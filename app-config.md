# Savage Worlds Game Tracker - Application Configuration

This file contains reasonable safe default values for the Savage Worlds Wild Card Manager application.

## General Settings

- **Default Target Number (TN)**: 4
- **Wild Die Type**: d6
- **Starting Bennies**: 3
- **Max Wounds**: 3
- **Max Fatigue**: 2
- **Language**: English
- **Theme**: Parchment

## Dice Mechanics

- **Acing (Exploding Dice)**: Enabled
- **Critical Failure Rule**: Natural 1 on both Trait and Wild Die
- **Unskilled Penalty**: -2 (d4 Trait Die)

## Storage & Persistence

- **Save Interval**: 5 seconds (auto-save to localStorage)
- **History Log Limit**: 100 entries
- **Persistence Type**: LocalStorage (via Zustand)

## UI Settings

- **Mobile First**: True
- **Animations**: Enabled (Subtle)
- **Haptic Feedback**: Enabled (if supported)
- **Sound Effects**: Disabled

## Feature Flags

- **Adventure Log**: Enabled
- **Inventory Management**: Enabled
- **Power Tracking**: Enabled
- **PWA Support**: Enabled
