import torch  # pytorch
import torch.nn as nn


class LeNet5(nn.Module):
    """
    Building LeNet-5 model accroding to original paper.
    """

    # Contructor
    def __init__(self, out_1=6, out_2=16):
        super().__init__()
        self.conv1 = nn.Conv2d(in_channels=1, out_channels=out_1, kernel_size=5)
        self.conv2 = nn.Conv2d(in_channels=out_1, out_channels=out_2, kernel_size=5)
        self.avgpool = nn.AvgPool2d(kernel_size=2)
        self.flatten = nn.Flatten()
        self.tanh = nn.Tanh()
        self.fc1 = nn.Linear(5 * 5 * 16, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        x = self.avgpool(self.conv1(x))
        x = self.avgpool(self.conv2(x))
        x = self.flatten(x)
        x = self.tanh(self.fc1(x))
        x = self.tanh(self.fc2(x))
        x = self.fc3(x)
        return x
