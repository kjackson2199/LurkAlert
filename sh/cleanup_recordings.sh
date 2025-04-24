#!/bin/bash

echo "Cleanup run at $(date)" >> /var/log/lurk_cleanup.log
find /home/lurk/recordings -type f -name "*.mp4" -mtime +2 -print -delete >> /var/log/lurk_cleanup.log