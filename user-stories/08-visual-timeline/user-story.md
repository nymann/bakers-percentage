# Drag Timeline Handles to Plan Schedule

## Slice
5 — Visual Timeline

## Story
As a sourdough baker, I want to drag mix and bake handles on a visual timeline with colored zones, so that I can intuitively plan my baking schedule.

## Acceptance Criteria
- Horizontal bar represents next 48h from now
- Background painted with red/yellow/green zone colors relative to bake handle
- Two draggable handles: Mix (left) and Bake (right)
- Bake handle defaults to tomorrow 09:00
- Mix handle defaults to green-zone position
- Handles snap to 15-minute increments
- Dragging either handle live-updates schedule, starter %, and method
- Dragging mix handle into red zone shows warning and disables recipe output
- Use-case invocation debounced during drag
