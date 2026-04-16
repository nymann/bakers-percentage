# Testing Library - Guiding Principles

Source: https://testing-library.com/docs/guiding-principles

## Core Philosophy

The Testing Library project is built around a central principle: testing practices should mirror how users actually interact with software. As the documentation states, "The more your tests resemble the way your software is used, the more confidence they can give you."

## Three Guiding Principles

The library's utilities are designed around three key guidelines:

1. **DOM-Focused Testing**: When testing rendered components, the focus should be on DOM nodes rather than component instances, avoiding direct manipulation of component internals.

2. **User-Centric Approach**: Utilities should facilitate tests that reflect actual user behavior and intended component usage, while acknowledging practical limitations of simulated browser environments.

3. **Simple & Flexible APIs**: Implementations should maintain straightforward, adaptable designs that remain easy to understand and use.

## Overall Design Goals

The overarching aim is to create a lightweight, simple, and understandable testing library that encourages developers to write tests aligned with real-world usage patterns.

---

Last updated: November 4, 2020
Last editor: Matan Borenkraout
Copyright: 2018-2026 Kent C. Dodds and contributors
