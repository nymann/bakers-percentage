# Walking Skeleton

## Slice
1 — Yeast Recipe Calculator

## Story
As a home baker, I want to see a complete recipe with real ingredient weights the moment I open the app, so that I can start baking without any setup.

## Acceptance Criteria
- App loads with defaults: 1 loaf, 800g, 75% hydration, instant yeast, 2% salt, 13% bake-off loss
- Results table renders flour, water, salt, and yeast in grams with baker's percentages
- Gram values match baker's math for the defaults (rounded to nearest integer)
- All inputs and results visible without scrolling on a single page

**Note:** Slice 1 defaults to instant yeast as the simplest leavening to prove
the architecture end-to-end. Slice 2 (Story 04) changes the app default to
sourdough. The walking skeleton scenario values apply to the Slice 1 yeast
default only.

## Non-Functional Requirements
- Hexagonal architecture: domain, application (ports + use cases), adapters (driving + driven)
- Architecture tests enforce dependency rules
- Deployed to GitHub Pages via CI on every push to main

## Purpose
Proves the full vertical slice: Vue driving adapter → use case → domain → rendered output. The thinnest possible end-to-end that's shippable.
