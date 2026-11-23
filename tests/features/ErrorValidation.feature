@Regression
Feature: Login validations
@loginValidation
Scenario Outline: Reject invalid login credentials
  Given I open the practice login application
  When I enter username "<username>" and password "<password>"
  Then I should see an incorrect credentials message

  Examples:
    | username   | password        |
    | invalidUser | invalidPassword |
    | wrongUser   | wrongPassword   |


  @loginValidation
  Scenario: Login with valid credentials
    Given I open the practice login application
    When I login with username "rahulshettyacademy" and password "Learning@830$3mK2"
    Then I should be redirected to the shop

  @ecommerce
  Scenario: Ecommerce login rejects invalid credentials
    Given an invalid login to Ecommerce application with "not-a-real-user-928374@example.com" and "DefinitelyWrong123!"
    Then Verify error message is displayed

 