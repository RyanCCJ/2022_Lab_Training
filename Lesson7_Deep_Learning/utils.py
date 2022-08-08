import torch
import torch.nn.functional as F
from tqdm import tqdm
import numpy as np
import matplotlib.pyplot as plt
import os


def check_gpu():
    """
    Check whether GPU is avaliable.
    """
    if torch.cuda.is_available():
        device = torch.device("cuda:0")
        print("GPU is avalible.")
        print("Working on:", torch.cuda.get_device_name())
    else:
        device = torch.device("cpu")
        print("GPU is not avalible.")
        print("Working on CPU")
    return device


def train_model(
    model,
    train_loader,
    validation_loader,
    optimizer,
    train_dataset,
    validation_dataset,
    criterion,
    device,
    n_epochs=4,
):
    """
    Training model and save metrics.
    """
    # num of samples
    N_train = len(train_dataset)
    N_test = len(validation_dataset)

    # save metrics
    train_acc = []
    cv_acc = []
    train_loss = []
    cv_loss = []

    for epoch in tqdm(range(n_epochs)):

        # training
        training_loss = []
        correct = 0
        model.train()
        for x, y in train_loader:
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            z = model(x)
            _, yhat = torch.max(z.data, 1)
            correct += (yhat == y).sum().item()
            loss = criterion(z, y)
            loss.backward()
            optimizer.step()
            training_loss.append(loss.item())

        train_loss.append(np.mean(training_loss))
        train_acc.append(correct / N_train)

        # validation
        training_loss = []
        correct = 0
        model.eval()
        with torch.no_grad():
            for x_test, y_test in validation_loader:
                x_test, y_test = x_test.to(device), y_test.to(device)
                z = model(x_test)
                _, yhat = torch.max(z.data, 1)
                correct += (yhat == y_test).sum().item()
                loss = criterion(z, y_test)
                training_loss.append(loss.item())

            cv_loss.append(np.mean(training_loss))
            cv_acc.append(correct / N_test)

    return train_acc, cv_acc, train_loss, cv_loss


def plot_lr(train_acc, cv_acc, train_loss, cv_loss):
    """
    plot learning curve.
    """
    save_folder = check_path("figures")

    plt.figure(figsize=(12, 8))
    plt.plot(train_acc, label="train_acc")
    plt.plot(cv_acc, label="cv_acc")
    plt.title("train / valid  accuracy")
    plt.xlabel("epochs")
    plt.ylabel("acc")
    axes = plt.gca()
    axes.set_ylim([0.5, 1])
    plt.legend()
    plt.grid()
    plt.savefig(os.path.join(save_folder, "acc.jpg"), bbox_inches="tight")
    plt.close()

    plt.figure(figsize=(12, 8))
    plt.plot(train_loss, label="train_cost")
    plt.plot(cv_loss, label="cv_acc")
    plt.title("train / valid  loss")
    plt.xlabel("epochs")
    plt.ylabel("loss")
    # axes = plt.gca()
    # axes.set_ylim([0, 1])
    plt.legend()
    plt.grid()
    plt.savefig(os.path.join(save_folder, "loss.jpg"), bbox_inches="tight")
    plt.close()


def check_path(fname):
    """
    Check whether folder exist or not.
    """
    pwd = os.getcwd()
    save_folder = os.path.join(pwd, fname)
    if not os.path.isdir(save_folder):
        os.mkdir(save_folder)
        print("Create path:", save_folder)
    return save_folder


def predict_data(model, data_loader, device):
    """
    Predict input data for submission.
    """
    pred = []
    model.eval()
    with torch.no_grad():
        for x_test, _ in data_loader:
            x_test = x_test.to(device)
            z = model(x_test)
            _, yhat = torch.max(z.data, 1)
            pred.extend(yhat.cpu().detach().numpy())

    return pred
