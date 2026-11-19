#!/bin/bash
# A simple interest calculator for educational use.

read -r -p "Enter the principal amount: " p
read -r -p "Enter annual interest rate (%): " r
read -r -p "Enter time period in years: " t

if ! [[ $p =~ ^[0-9]+([.][0-9]+)?$ && $r =~ ^[0-9]+([.][0-9]+)?$ && $t =~ ^[0-9]+([.][0-9]+)?$ ]]; then
  echo "Please enter non-negative numeric values."
  exit 1
fi

interest=$(awk -v p="$p" -v r="$r" -v t="$t" 'BEGIN { printf "%.2f", p * r * t / 100 }')
echo "Simple interest: $interest"
