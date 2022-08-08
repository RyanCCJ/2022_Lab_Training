import argparse
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from torchsummary import summary
import torchvision.datasets as dsets
import matplotlib.pylab as plt
import numpy as np
import random
from tqdm.notebook import tqdm

# custom module
from utils import *
from model import LeNet5

# argparser
parser = argparse.ArgumentParser()
parser.add_argument(
    "-m",
    "--mode",
    nargs="?",
    type=str,
    choices=["train", "pred"],
    default="train",
    help="train model or evaluate data.",
)
parser.add_argument(
    "-bs",
    "--batch_size",
    nargs="?",
    type=int,
    default=64,
    help="Number of training epochs.",
)
parser.add_argument(
    "-epo",
    "--epochs",
    nargs="?",
    type=int,
    default=4,
    help="Number of training epochs.",
)
parser.add_argument(
    "-lr",
    "--learning_rate",
    nargs="?",
    type=float,
    default=5e-4,
    help="learning rate",
)
args = parser.parse_args()


# keep reandom seed
seed_val = 0
random.seed(seed_val)
np.random.seed(seed_val)
torch.manual_seed(seed_val)

# transform
IMAGE_SIZE = 32  # Original size: 28
composed = transforms.Compose(
    [
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
    ]
)

if args.mode == "train":
    # dataset
    train_dataset = dsets.MNIST(
        root="./data", train=True, download=True, transform=composed
    )
    validation_dataset = dsets.MNIST(
        root="./data", train=False, download=True, transform=composed
    )
    print("Length of train_dataset:", len(train_dataset))
    print("Length of validation_dataset:", len(validation_dataset))

    # model
    device = check_gpu()
    model = LeNet5(out_1=6, out_2=16)
    model.to(device)
    summary(model, (1, 32, 32))

    # hyperparameters
    criterion = nn.CrossEntropyLoss()

    optimizer = torch.optim.Adam(model.parameters(), lr=args.learning_rate)

    train_loader = torch.utils.data.DataLoader(
        dataset=train_dataset, batch_size=args.batch_size
    )
    validation_loader = torch.utils.data.DataLoader(
        dataset=validation_dataset, batch_size=1024
    )

    # training
    train_acc, cv_acc, train_loss, cv_loss = train_model(
        model=model,
        n_epochs=args.epochs,
        train_loader=train_loader,
        validation_loader=validation_loader,
        train_dataset=train_dataset,
        validation_dataset=validation_dataset,
        criterion=criterion,
        device=device,
        optimizer=optimizer,
    )

    # learning curve
    plot_lr(train_acc, cv_acc, train_loss, cv_loss)

    # metrics
    print("[Train] ACC: %2.4f" % train_acc[-1])
    print("[Train] LOSS: %2.4f" % train_loss[-1])
    print()
    print("[Test] ACC: %2.4f" % cv_acc[-1])
    print("[Test] LOSS: %2.4f" % cv_loss[-1])

    # save model
    save_folder = check_path("model")
    save_path = os.path.join(save_folder, "model.pt")
    torch.save(model.state_dict(), save_path)

else:
    import pandas as pd

    test_dataset = dsets.MNIST(
        root="./data", train=False, download=True, transform=composed
    )

    # model
    device = check_gpu()
    model = LeNet5(out_1=6, out_2=16)
    save_folder = check_path("model")
    model.load_state_dict(torch.load(os.path.join(save_folder, "model.pt")))
    model.to(device)
    model.eval()
    summary(model, (1, 32, 32))

    # data loader
    test_loader = torch.utils.data.DataLoader(dataset=test_dataset, batch_size=1024)

    # predict
    pred = predict_data(model, test_loader, device)

    # save predict
    save_folder = check_path("submission")
    save_path = os.path.join(save_folder, "submission.csv")
    df = pd.DataFrame({"label": pred})
    print(df)
    print(save_path)
    df.to_csv(save_path, index=False)
