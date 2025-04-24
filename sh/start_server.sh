# !/bin/bash
source variables.sh

# Start the virtual environment
cd ~/LurkAlert/src/back-end
. ~/lurkalert/bin/activate

# Launch the server
# This will start the server in the background
npm start
