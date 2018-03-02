/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    Platform,
    StyleSheet,
    Navigator,
    Image,
    Text,
    View,
} from 'react-native';

import setup from './js/pages/setup'

AppRegistry.registerComponent('RNAPPGithub', () => setup);
