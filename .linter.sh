#!/bin/bash
cd /home/kavia/workspace/code-generation/openshop-connect-28058-18b522d4/openshop_connect_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

