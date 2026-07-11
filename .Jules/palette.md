## 2024-05-18 - Missing ARIA labels
**Learning:** Found multiple icon-only buttons missing `aria-label`s in the components.
**Action:** Always check `Button` usage with `size="icon-sm"` or `size="icon"` for missing `aria-label` attributes.
## 2024-05-18 - Missing ARIA labels and disabled states
**Learning:** Forms often miss `<label>` elements for `Input`, `Textarea`, and `select` fields, relying instead on placeholders which are insufficient for screen readers. Submit buttons can also miss disabling during processing.
**Action:** When updating forms, always check if fields have proper `<label>` elements or `aria-label`s, and ensure the submit button is `disabled` when processing (and ideally add a loading spinner).
