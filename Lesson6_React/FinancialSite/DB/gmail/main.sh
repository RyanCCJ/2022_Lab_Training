#!/bin/sh
cd /home/cosbi/financialSite/DB/gmail/
python3 /home/cosbi/financialSite/DB/gmail/getGmail_main.py
python3 /home/cosbi/financialSite/DB/gmail/update2SQL.py
