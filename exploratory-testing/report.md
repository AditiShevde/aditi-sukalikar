# N26 Home Challenge — Task 1

## Exploratory Testing Report: Monefy - Budget & Expenses App  (Android)

**Candidate:** Aditi Sukalikar  
**Date:** March 22, 2026


|                        |                            |
| ---------------------- | -------------------------- |
| **Application tested** | Monefy - Budget & Expenses App (Android)           |
| **Version**            | 1.22.10                    |
| **Device**             | Samsung S24 (Android 16)   |
| **Testing duration**   | 2 hours (strictly adhered) |


---

## 1. Executive Summary

This exploratory testing session was conducted on the Monefy Money Manager Android application with a focus on core financial functionality, edge cases, and data integrity. The session revealed that while the application provides a clean and intuitive user interface for basic expense/income tracking, several critical issues were identified that could impact user trust and data accuracy; particularly concerning synchronization, calculation consistency, and offline behavior.

### Key finding

**Data integrity during synchronization** is the highest risk area. When transactions are made offline and later synced, balance calculations can become inconsistent, potentially leading to financial discrepancies that undermine user trust; a critical concern for any financial application.

---

## 2. Exploratory Testing Charters

Four focused charters were executed, each with specific objectives and timeboxes:

### Charter 1 — Core Transaction Entry (~15 minutes)

- **Goal:** Validate that basic expense/income tracking works as expected and that the balance updates correctly.
- **Purpose:** Verify that the primary user journey of adding a transaction (expense and income) works correctly end-to-end.
- **Approach:**
  - Add a single expense and select a category.
  - Add a single income and select a category.
  - Add multiple expenses across different categories.
  - Add multiple income entries.
  - Verify amounts reflect correctly on the home screen pie chart.

### Charter 2 — Boundary & Negative Input Handling (~15 minutes)

- **Goal:** Test application behavior under unusual or extreme conditions.
- **Purpose:** Verify the app handles edge-case inputs without crashing or storing incorrect data.
- **Approach:**
  - Enter zero (0) value.
  - Enter negative values for expenses/income.
  - Test with very large amounts (e.g., 999999999).
  - Test with very low amounts (e.g. 0.001)
  - Test with multiple decimal points.
  - Rapid clicking on buttons (multiple taps).
  - Test offline mode: add transactions without internet/airplane mode, then reconnect.

### Charter 3 — Data Editing & Deletion (~15 minutes)

- **Goal:** Edit and delete existing transactions.
- **Purpose:** Ensure users can edit or delete existing transactions, fix mistakes or remove unwanted entries while keeping their account balance accurate.
- **Approach:**
  - Create sample transactions (income and expenses).
  - Edit amount and category.
  - Save and verify updates.
  - Delete transactions.
  - Verify balance updates.
  - Verify pie chart updates correctly.

### Charter 4 — Date & Time Filtering (~15 minutes)

- **Goal:** Time-range filters (day / week / month / year / all / interval).
- **Purpose:** Confirm that filtering transactions by time period correctly scopes the pie chart, balance, and transaction list.
- **Approach:**
  - Add transactions across different dates.
  - Select each filter (day/week/month/year/all/interval).
  - Verify only relevant transactions are shown.
  - Check totals update correctly.

---

## 3. Findings & Bug Discoveries

### Bug #1: Deletion without confirmation prompt

**Severity:** HIGH | **Reproducibility:** 100%

**Steps to reproduce**

1. Open a transaction.
2. Tap Delete icon.
3. Transaction is deleted immediately without a confirmation prompt.

**Expected:** App should ask for confirmation (e.g. “Are you sure you want to delete this transaction?”).

**Actual:** Transaction is deleted instantly.

**Impact:** High — risk of accidental data loss.

---

### Bug #2: Input boundaries not clearly defined

**Severity:** MEDIUM | **Reproducibility:** 100%

**Steps to reproduce**

1. Open a transaction.
2. Enter an extremely large amount (e.g., 999999999) or extremely small amount (0.01).
3. Click the back button to save.

**Expected**

- The app should only allow transaction amounts within a set minimum and maximum range.
- Input limits are clearly communicated via placeholders, hints, or tooltips.
- Invalid entries show a validation message and cannot be saved.

**Actual**

- App accepts extremely large or small values without warnings.
- No guidance or limits communicated to the user.

**Impact:** Medium — users may enter unrealistic amounts leading to potential data inconsistencies or confusion.

---

### Bug #3: Auto-save confusion

**Severity:** LOW | **Reproducibility:** 80%

**Steps to reproduce**

1. Edit a transaction.
2. Click the back button without any visible “Save” action.

**Expected:** User should see confirmation or manual save prompt before leaving.

**Actual:** Changes are saved automatically, but the user is not informed.

**Impact:** Low — users may be uncertain whether changes were saved.

### Positive findings (working as expected)

- **Core functionality:** Adding expenses and income works correctly under normal conditions.
- **Boundary & Negative:** Input Handling: Application handled zero, very large numbers, and multiple decimals without crashing.
- **Offline mode:** Offline mode allowed adding transactions, and data synced correctly after reconnecting.
- **Editing & deletion:** Transactions can be edited or deleted, and balance/pie chart updates correctly.
- **Date & time filtering:** Filters for day/week/month/year/all/interval work as expected.

---

## 4. Charter Prioritization & Rationale


| Priority | Charter                                                | Rationale for priority                                                                           | Business impact                                                                |
| -------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| HIGH     | Charter 3: Prevent accidental deletion of transactions | Deleting transactions without confirmation can cause irreversible data loss                     | Users may lose critical financial data, decreasing trust in the app            |
| MEDIUM   | Charter 2: Define Input Boundaries and Limits | Users can enter extremely large, small or invalid amounts, which may cause calculation errors or app instability| Incorrect transaction data can lead to inaccurate reports and increase support requests|
| LOW      | Charter 3: Clarify auto-save behavior                  | Users may not realize edits are saved automatically, causing uncertainty                         | Minor impact on user experience; confusion rather than loss of data            |


### Testing time allocation justification

Allocating 15 minutes to each charter was appropriate because:

- Core functionalities (transaction entry, editing, deletion) require thorough end-to-end validation.
- Edge-case inputs and boundary testing need careful observation to prevent data errors.
- Date/time filters and pie chart updates must be verified across multiple scenarios.
- Equal time ensures balanced coverage and consistency across all critical user journeys.

---

## 5. Risk Analysis & Mitigation Recommendations

### Risk category 1: Accidental data loss

**Risk:** Users may unintentionally delete important transactions, causing loss of financial records.

**Mitigation**

- Implement a confirmation dialog before deletion (e.g. “Are you sure you want to delete this transaction?”).
- Consider adding an undo option for recently deleted transactions.

### Risk category 2: Unrealistic transaction values

**Risk:** Accepting extremely high and extremely low can create inconsistencies in account balances and reports.

**Mitigation**

- Define minimum and maximum allowed transaction amounts.
- Clearly communicate limits using placeholders, hints, or tooltips.
- Display validation messages for invalid entries and prevent saving until corrected.

### Risk category 3: User confusion over auto-save

**Risk:** Users may be unsure whether their changes have been saved, leading to duplicate edits or abandoned work.

**Mitigation**

- Add a visible save confirmation or toast message when edits are auto-saved. Alternatively, provide an explicit “Save” button with feedback on success/failure.

### Summary

These issues collectively impact both data accuracy and user confidence. Addressing them with clear validations, confirmations, and feedback mechanisms will reduce errors and improve the overall user experience.

---

## 6. Conclusion & Recommendations

The exploratory testing session covered critical user flows including transaction entry, boundary input handling, data editing/deletion, and date-based filtering. Within the defined 2-hour timebox, all tested functionalities performed as expected without any major or critical defects.

The application demonstrated strong stability across both normal and edge-case scenarios. Core features such as balance calculation, pie chart updates, and filtering logic were accurate and consistent, ensuring a reliable user experience for financial tracking.

However, certain areas — particularly around input validation — present opportunities for improvement to enhance overall robustness and usability.

### Immediate action items (priority order)

1. **Introduce user feedback for invalid inputs (high priority)**
  - Display clear error messages for unsupported or unusual inputs.
2. **Provide clear save / confirmation feedback (high priority)**
  - Add a visible “Save” button or a confirmation message when data is changed.
  - Ensures the user knows their changes are saved before leaving the screen.
3. **Implement confirmation modal (high priority)**
  - Include two buttons: “Cancel” and “Confirm/Delete”.
  - Prevents accidental deletion of financial data.
4. **Provide undo option (medium priority)**
  - After confirming deletion, optionally allow “Undo” for a few seconds.
  - Enhances user trust and reduces mistakes.
5. **Define input boundaries and limits (medium priority)**
  - Establish maximum and minimum allowable transaction values.
  - Clearly communicate limits via placeholders, hints, or tooltips.

### Testing strategy recommendations

- **Input validation & feedback checks:** Verify that invalid inputs (negative numbers, multiple decimals, large amounts) trigger proper error messages or guidance.
- **UX & auto-save validation:** Ensure auto-save behavior is clearly indicated to users and deletion actions are confirmed via modal prompts with optional undo.
- **Automated regression suite:** Create tests for all core transaction flows.
- **Data integrity monitoring:** Implement periodic checks to validate calculations, pie chart consistency, and account balances across all user accounts.
- **User acceptance testing:** Engage real users for edge case discovery in production-like environments.

---