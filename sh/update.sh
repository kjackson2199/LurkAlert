source /home/lurk/LurkAlert/sh/variables.sh

cd $USER_HOME
# update script for LurkAlert
# This script is intended to be run as root
# check if the script is run as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root"
    exit
fi

# Check if zip file exists
if [ -f "master.zip" ]; then
    echo "master.zip already exists, deleting..."
    rm -rfv master.zip
fi

# get latest repository on github
wget $GITHUB_URL
if [ $? -ne 0 ]; then
    echo "Failed to download the latest version from GitHub"
    exit 1
fi

unzip master.zip
rm -rfv master.zip

# Remove old directory if it exists
if [ -d "LurkAlert" ]; then
    echo "LurkAlert directory already exists, deleting..."
    rm -rfv LurkAlert
fi

mv LurkAlert-master LurkAlert
cd LurkAlert

. $PYTHON_ENV_DIR/bin/activate