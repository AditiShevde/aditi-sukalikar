Feature: Monefy Android - smoke flows

  Baseline checks after Appium starts your app (APK or package/activity).

  Background:
    Given the Android app has launched

  Scenario: App session is active
    Then the app package should be "com.monefy.app.lite"

  Scenario: User completes onboarding
    When I finish onboarding
    Then I should see Claim My Offer button
    When I close the offer

  Scenario: User starts adding an expense
    When I tap expense
    Then I enter the amount "100"
    Then I select category "Food"
    Then the balance should update on home screen "-100"

  Scenario: User starts adding an income
    When I tap income
    Then I enter the amount "100"
    Then I select category "Deposits"
    Then the balance should update on dashboard "0"

  Scenario: User edits and deletes a transaction
    When I tap balance
    Then I tap on "Deposits"
    Then I tap on first transaction item 
    Then I edit amount as "200" and save
    Then I Delete the edited transaction
