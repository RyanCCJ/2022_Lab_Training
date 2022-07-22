import sys
import pprint
from typing import Any, List
import yfinance
import pandas as pd
from collections import defaultdict

import mplfinance as mpf
import plotly.graph_objects as go


class StockData(object):
    symbol = ""
    yf_ticker = None
    history = None
    _num_decimals = 2

    def __init__(self, symbol, start_date, end_date, timeframe="1d") -> None:
        self.symbol = symbol
        self.yf_ticker = yfinance.Ticker(symbol)
        self.history = self.yf_ticker.history(
            start=start_date, end=end_date, interval=timeframe
        )

        # round numerical
        self.history['Open'] = self.history['Open'].round(self._num_decimals)
        self.history['High'] = self.history['High'].round(self._num_decimals)
        self.history['Low'] = self.history['Low'].round(self._num_decimals)
        self.history['Close'] = self.history['Close'].round(self._num_decimals)


class TechnicalAnalysisBase(object):
    def __init__(self) -> None:
        pass

    def check_param_exists(self, param) -> None:
        if not hasattr(self, param):
            raise ValueError(f"The parameter {param} is not defined in the class.")       

    def set_check_inputs(self, param, value) -> None:
        self.check_param_exists(param)
        if (not isinstance(value, type(getattr(self, param)))):
            raise TypeError(
                f"The parameter {param} takes data type {type(getattr(self, param))}."
            )

    def get(self, param) -> Any:
        self.check_param_exists(param)
        return getattr(self, param)


class Peaks(TechnicalAnalysisBase):
    peak_left: int
    peak_right: int
    
    def __init__(self, peak_left=3, peak_right=3) -> None:
        super().__init__()
        self.peak_left = peak_left
        self.peak_right = peak_right
        
    def set(self, param, value) -> None:
        super().set_check_inputs(param, value)
        if value<1:
            raise ValueError(f"The parameter {param} takes an integer greater than 0.")
        setattr(self, param, value)    

    def detect(self, stock_history) -> List:
        return [
            stock_history.index[i-self.peak_right]
            for i in range(len(stock_history))
            if (i>=(self.peak_left+self.peak_right)) and (
                stock_history['High'][i-self.peak_right]==
                max(stock_history['High'][i-self.peak_left-self.peak_right:i+1])
            )
        ]
    

class Valleys(TechnicalAnalysisBase):
    valley_left: int
    valley_right: int
    
    def __init__(self, valley_left=3, valley_right=3) -> None:
        super().__init__()
        self.valley_left = valley_left
        self.valley_right = valley_right
        
    def set(self, param, value) -> None:
        super().set_check_inputs(param, value)
        if value<1:
            raise ValueError(f"The parameter {param} takes an integer greater than 0.")
        setattr(self, param, value)    

    def detect(self, stock_history) -> List:
        return [
            stock_history.index[i-self.valley_right]
            for i in range(len(stock_history))
            if (i>=(self.valley_left+self.valley_right)) and (
                stock_history['Low'][i-self.valley_right]==
                min(stock_history['Low'][i-self.valley_left-self.valley_right:i+1])
            )
        ]


class SupportResistance(Peaks, Valleys):
    """ Detect support and resistance levels.

    Input: 
        parameters of peaks and valleys
        max number of swaps between support and resistance
    """
    peak_left: int
    peak_right: int
    valley_left: int
    valley_right: int
    max_num_supp_resis_swaps: int
    _supp_name = "support"
    _resis_name = "resistance"
    
    def __init__(self, peak_left=3, peak_right=3, valley_left=3, valley_right=3, 
        max_num_supp_resis_swaps=1,
    ):
        Peaks.__init__(self, peak_left=peak_left, peak_right=peak_right)
        Valleys.__init__(self, valley_left=valley_left, valley_right=valley_right)
        self.max_num_supp_resis_swaps = max_num_supp_resis_swaps
        
    def detect(self, stock_history, supp_resis=None):
        """
        Output: a dictionary with keys being a tuple (price, date) and values being 
        a list of segment endings. For example, the price 152 on 2021-06-15  is a 
        newly detected valley, and its support is valid till 2021-07-09, followed by 
        changing to resistance till "2021-08-20"; the data entry is recorded as:
        { 
            ("2021-06-15", 152): [ 
                ["2021-07-09", "support"], 
                ["2021-08-20", "resistance"]
            ] 
        }
        """
        if supp_resis is None:
            supp_resis = defaultdict(list)        

        # loop over days starting at the 3rd day
        for i in range(2, len(stock_history)):
            # detect new peak
            if i >= self.peak_left+self.peak_right:
                det_date = Peaks.detect(self, stock_history.iloc[
                    list(range(i-self.peak_left-self.peak_right, i+1))
                ])
                # add newly detected peak with its level extended to yesterday
                if len(det_date) > 0:
                    supp_resis[
                        (det_date[0], stock_history.at[det_date[0], 'High'])
                    ].append([stock_history.index[i-1], self._resis_name])

            # detect new valley
            if i >= self.valley_left+self.valley_right:
                det_date = Valleys.detect(self, stock_history.iloc[
                    list(range(i-self.valley_left-self.valley_right, i+1))
                ])
                if len(det_date) > 0:
                    supp_resis[
                        (det_date[0], stock_history.at[det_date[0], 'Low'])
                    ].append([stock_history.index[i-1], self._supp_name])

            if len(supp_resis) == 0:
                continue

            # AFTER a new peak/valley being detected, update supp_resis to today 
            for pricekey in supp_resis.keys():
                # check breakup
                if ((pricekey[1] < stock_history['Close'][i] ) and  
                    supp_resis[pricekey][-1][1] == self._resis_name 
                ):  
                    # not yet reach max number of segments (i.e., 1 + max_num_supp_resis_swaps)
                    if len(supp_resis[pricekey]) < self.max_num_supp_resis_swaps+1:
                        supp_resis[pricekey].append([stock_history.index[i], self._supp_name])                
                
                # check breakdown
                elif ((pricekey[1] > stock_history['Close'][i]) and 
                    supp_resis[pricekey][-1][1] == self._supp_name 
                ):  
                    if len(supp_resis[pricekey]) < self.max_num_supp_resis_swaps+1:
                        supp_resis[pricekey].append([stock_history.index[i], self._resis_name])  
                
                # if price level is alive, replace last segment's ending date with today's date
                elif supp_resis[pricekey][-1][0] == stock_history.index[i-1]:
                    supp_resis[pricekey][-1][0] = stock_history.index[i]

            self.remove_redundancy()

        return supp_resis

    def remove_redundancy(self,):
        #TODO
        pass        
        

def plot_plotly(stock_data):
    history = stock_data.history
    history.reset_index(inplace=True)
    fig = go.Figure(
        data=[
            go.Candlestick(
                x=history['Date'],
                open=history['Open'], 
                high=history['High'],
                low=history['Low'], 
                close=history['Close']
            )
        ]
    )
    fig.show()


def plot_mplfinance(stock_data, stock_supp_resis, show_inactive=False):
    points, colors = [], []
    for pricekey in stock_supp_resis.keys():
        if (not show_inactive) and (stock_supp_resis[pricekey][-1][0]!=stock_data.history.index[-1]):
            continue
        
        points.append([pricekey, (stock_supp_resis[pricekey][0][0], pricekey[1])])
        colors.append("y") if stock_supp_resis[pricekey][0][1]=="resistance" else colors.append("b")
        
        if len(stock_supp_resis[pricekey])==1:
            continue
        
        for i in range(len(stock_supp_resis[pricekey])-1):
            points.append([
                (stock_supp_resis[pricekey][i][0], pricekey[1]),
                (stock_supp_resis[pricekey][i+1][0], pricekey[1]),
            ])
            colors.append("y") if stock_supp_resis[pricekey][i+1][1]=="resistance" else colors.append("b")

    mpf.plot(stock_data.history, type='candle', style='yahoo', volume=True, 
        show_nontrading=False, alines=dict(alines=points, colors=colors),
    )


def run():
    # settings
    symbol = "SPY"
    start_date = "2021-07-01"
    end_date = "2022-06-20"

    stock_data = StockData(symbol, start_date, end_date)
    analysis = {
        'peaks': Peaks(),
        'valleys': Valleys(),
        'supp_resis': SupportResistance(peak_left=3, peak_right=3, 
            valley_left=3, valley_right=3, max_num_supp_resis_swaps=1),
    }

    # detect peaks and valleys in a batch
    if False:
        peaks_dates = analysis['peaks'].detect(stock_data.history)
        valleys_dates = analysis['valleys'].detect(stock_data.history)
        print("\nStock Peaks:")
        print(stock_data.history.loc[peaks_dates])
        print("\nStock Valleys:")
        print(stock_data.history.loc[valleys_dates])

    # detect support and resistance levels
    stock_supp_resis = analysis['supp_resis'].detect(stock_data.history)
    pprint.pprint(stock_supp_resis)

    # visualize stock chart
    #plot_plotly(stock_data)
        
    # visualize support and resisatnce
    plot_mplfinance(stock_data, stock_supp_resis, show_inactive=True)
    plot_mplfinance(stock_data, stock_supp_resis, show_inactive=False)


if __name__ == "__main__":
    print("Running stock support and resistance")
    run()
    sys.exit("System ends")
