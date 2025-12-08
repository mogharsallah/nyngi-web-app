# Story 2.8: User Profile Display & Sign Out

Status: drafted

## Story

As a logged-in user,
I want to see my profile information and sign out,
so that I can manage my session securely.

## Acceptance Criteria

1. **Profile Dropdown:** Clicking the user avatar in the header opens a dropdown menu.
2. **Menu Content:** The menu displays:
    - User's email address (truncated if long).
    - "Order History" link (navigates to `/orders`).
    - "Settings" link (placeholder, navigates to `/settings` or disabled).
    - Divider.
    - "Sign Out" button (destructive style).
3. **Sign Out Flow:**
    - Clicking "Sign Out" triggers a confirmation dialog: "Are you sure you want to sign out?".
    - On confirmation:
        - Session is terminated (Supabase auth sign out).
        - Client-side state is cleared (Zustand `sessionStore` and `namingStore` reset).
        - User is redirected to `/auth/login`.
        - A toast notification appears: "You've been signed out".
4. **Mobile Responsiveness:**
    - On mobile, the profile options are accessible via the main navigation menu or a visible profile icon.
5. **Avatar:**
    - Displays the user's profile picture if available (future proofing).
    - Fallback to user's initial if no picture is available.

## Tasks / Subtasks

- [ ] Create `UserProfileMenu` component
    - [ ] Implement dropdown structure using `shadcn/ui` `DropdownMenu`.
    - [ ] Display user email (fetch from session).
    - [ ] Add navigation links.
    - [ ] Implement avatar with user initial fallback (AC: #5).
- [ ] Implement Sign Out Logic (AC: #3)
    - [ ] Create `handleSignOut` utility/hook that:
        - Calls Supabase auth sign out.
        - Resets `sessionStore`.
        - Resets `namingStore`.
        - Redirects to login.
        - Shows toast.
- [ ] Integrate into Header
    - [ ] Add `UserProfileMenu` to `components/shared/header.tsx`.
    - [ ] Ensure proper positioning and styling.
- [ ] Mobile Adaptation
    - [ ] Update `components/shared/mobile-header.tsx` to include profile access.
- [ ] Testing
    - [ ] Unit test for `UserProfileMenu` rendering.
    - [ ] E2E test for sign-out flow (login -> open menu -> sign out -> verify redirect).

## Dev Notes

- **Architecture Alignment:**
    - Ensure `sessionStore` and `namingStore` are reset to prevent data leakage between users on shared devices.
    - Use Supabase client SDK for sign-out (cookie clearing requires client-side call).
- **Components:**
    - `components/features/auth/user-profile-menu.tsx`
- **State Management:**
    - Access user info via `useSessionStore` or directly from Supabase `useUser` hook (if available/configured).

### Project Structure Notes

- `components/features/auth/` is the correct location for the menu component.
- Use `shadcn/ui` DropdownMenu for the profile menu structure.

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.8-Profile-&-Sign-Out]
- [Source: docs/epics.md#Story-2.8-User-Profile-Display-&-Sign-Out]
- [Source: docs/architecture.md#Project-Structure]

## Dev Agent Record

### Context Reference

- [Context File](2-8-user-profile-display-sign-out.context.xml)

### Agent Model Used

Gemini 3 Pro (Preview)

### Debug Log References

### Completion Notes List

### File List


## Change Log

| Date       | Author   | Change Description                                                                      |
| ---------- | -------- | --------------------------------------------------------------------------------------- |
| 2025-12-08 | SM Agent | Initial story draft created from epics                                                  |
| 2025-12-08 | SM Agent | Validation fixes: added tech spec citation, avatar task, removed server/actions ref    |
