#!/bin/bash
# source variables.sh

# Start the virtual environment
cd /home/lurk/LurkAlert/src/back-end
. /home/lurk/lurkvenv/bin/activate

# Launch the server
# This will start the server in the background
npm start
