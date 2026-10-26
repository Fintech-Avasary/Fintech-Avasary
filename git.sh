#!/bin/bash

echo "Enter commit message:"
read -r s
git add .
git commit -m "$s" && git push