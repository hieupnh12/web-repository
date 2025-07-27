package com.app.product_warehourse;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("React Login UI Test")
public class LoginUITest {
    static WebDriver driver;
    static WebDriverWait wait;

    @BeforeAll
    static void setUp() {
        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        driver = new ChromeDriver(options);

        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @Test
    @Order(1)
    @DisplayName("Should login successfully with valid credentials")
    void testLoginSuccess() {
        driver.get("http://localhost:3000");

        WebElement usernameInput = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
        WebElement passwordInput = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(., 'Log In')]"));

        usernameInput.sendKeys("admin");
        passwordInput.sendKeys("admin");
        loginButton.click();

        // Chờ trang chuyển hướng sau khi đăng nhập (ví dụ admin -> /manager/dashboard)
        wait.until(ExpectedConditions.urlContains("/dashboard"));
        assertTrue(driver.getCurrentUrl().contains("/dashboard"));
    }

    @Test
    @Order(2)
    @DisplayName("Should show error with invalid credentials")
    void testLoginFail() {
        driver.get("http://localhost:3000");

        WebElement usernameInput = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
        WebElement passwordInput = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(., 'Log In')]"));

        usernameInput.clear();
        passwordInput.clear();
        usernameInput.sendKeys("invalid");
        passwordInput.sendKeys("wrongpass");
        loginButton.click();

        // Chờ lỗi server xuất hiện (div hiển thị serverError)
        WebElement errorDiv = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".login-error"))
        );
        Assertions.assertTrue(errorDiv.isDisplayed());

    }
    @Test
    @Order(3)
    @DisplayName("Should show error when no credentials are entered")
    void testLoginEmptyFields() {
        driver.get("http://localhost:3000");

        WebElement usernameInput = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
        WebElement passwordInput = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(., 'Log In')]"));

        usernameInput.clear();
        passwordInput.clear();
        loginButton.click();

        WebElement errorDiv = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".login-error"))
        );
        Assertions.assertTrue(errorDiv.isDisplayed());

    }

    @Test
    @Order(4)
    @DisplayName("Should show error when only username is entered")
    void testLoginMissingPassword() {
        driver.get("http://localhost:3000");

        WebElement usernameInput = wait.until(ExpectedConditions.elementToBeClickable(By.id("username")));
        WebElement passwordInput = driver.findElement(By.id("password"));
        WebElement loginButton = driver.findElement(By.xpath("//button[contains(., 'Log In')]"));

        usernameInput.clear();
        passwordInput.clear();
        usernameInput.sendKeys("admin"); // Chỉ nhập username
        loginButton.click();

        WebElement errorDiv = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".login-error"))
        );
        Assertions.assertTrue(errorDiv.isDisplayed());

    }

    @AfterAll
    static void tearDown() {
        driver.quit();
    }
}
