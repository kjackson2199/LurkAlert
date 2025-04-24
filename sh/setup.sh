#!/bin/bash

sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y libcap-dev
sudo apt-get install -y python3.11-dev
sudo apt-get install -y python3-picamera2
sudo apt-get install -y build-essential
sudo apt-get install -y ffmpeg

sudo apt install libcamera-dev libcamera-apps
sudo apt-get install -y build-essential cmake git unzip pkg-config
sudo apt-get install -y libjpeg-dev libtiff-dev libpng-dev
sudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install -y libgtk2.0-dev libcanberra-gtk* libgtk-3-dev
sudo apt-get install -y libgstreamer1.0-dev gstreamer1.0-gtk3
sudo apt-get install -y libgstreamer-plugins-base1.0-dev gstreamer1.0-gl
sudo apt-get install -y libxvidcore-dev libx264-dev
sudo apt-get install -y python3-dev python3-numpy python3-pip
sudo apt-get install -y libv4l-dev v4l-utils
sudo apt-get install -y libopenblas-dev libatlas-base-dev libblas-dev
sudo apt-get install -y liblapack-dev gfortran libhdf5-dev
sudo apt-get install -y libprotobuf-dev libgoogle-glog-dev libgflags-dev
sudo apt-get install -y protobuf-compiler

sudo apt-get install -y libtbbmalloc2 libtbb-dev libdc1394-dev gstreamer1.0-libcamera

sudo apt install -y python3-picamera2

# Install required python packages
pip install opencv-python-headless
pip install flask
pip install flask_sock
pip install flask-cors
pip install picamera2
pip install psutil
