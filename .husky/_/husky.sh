#!/bin/sh
# Husky shim
if [ -z "$husky_skip_init" ]; then
  export husky_skip_init=1
  sh "$0" "$@"
fi
