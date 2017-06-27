#!/bin/bash

# Install binaries and their dependencies globally
sudo npm install -g  rimraf                 \
                     react                  \
                     react-dom              \
                     jest-cli               \
                     @storybook/react       \
                     babel-cli              \
                     babel-eslint           \
                     eslint                 \
                     eslint-plugin-flowtype \
                     eslint-plugin-jest     \
                     eslint-plugin-react;

# Install dependencies locally except binaries
npm install --no-bin-links;
