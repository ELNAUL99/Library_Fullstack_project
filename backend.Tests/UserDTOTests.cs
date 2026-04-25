using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Library.DTOs;
using Xunit;

namespace Library.Tests
{
    public class UserDTOTests
    {
        /// <summary>
        /// Helper method to validate a DTO and return validation results.
        /// </summary>
        private List<ValidationResult> ValidateModel(object model)
        {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(model, null, null);
            Validator.TryValidateObject(model, validationContext, validationResults, true);
            return validationResults;
        }

        [Fact]
        public void UserRegisterDTO_Should_Pass_Validation_With_Valid_Data()
        {
            // Arrange
            var userDto = new UserRegisterDTO
            {
                FirstName = "John",
                LastName = "Doe",
                UserName = "johndoe",
                Email = "johndoe@example.com",
                Password = "Password123!"
            };

            // Act
            var validationResults = ValidateModel(userDto);

            // Assert
            Assert.Empty(validationResults); // No validation errors should occur
        }

        [Fact]
        public void UserRegisterDTO_Should_Fail_Validation_If_Required_Fields_Are_Missing()
        {
            // Arrange
            var userDto = new UserRegisterDTO
            {
                FirstName = "",
                LastName = "",
                UserName = "",
                Email = "invalid-email",
                Password = ""
            };

            // Act
            var validationResults = ValidateModel(userDto);

            // Assert
            Assert.NotEmpty(validationResults); // Validation errors should occur
            Assert.Equal(5, validationResults.Count); // Expecting 5 validation errors
        }

        [Fact]
        public void UserLoginDTO_Should_Pass_Validation_With_Valid_Data()
        {
            // Arrange
            var loginDto = new UserLoginDTO
            {
                UserName = "johndoe",
                Password = "Password123!"
            };

            // Act
            var validationResults = ValidateModel(loginDto);

            // Assert
            Assert.Empty(validationResults); // No validation errors should occur
        }

        [Fact]
        public void UserLoginDTO_Should_Fail_Validation_If_Required_Fields_Are_Missing()
        {
            // Arrange
            var loginDto = new UserLoginDTO
            {
                UserName = "",
                Password = ""
            };

            // Act
            var validationResults = ValidateModel(loginDto);

            // Assert
            Assert.NotEmpty(validationResults); // Validation errors should occur
            Assert.Equal(2, validationResults.Count); // Expecting 2 validation errors (one for each required field)
        }

        [Fact]
        public void UserUpdateDTO_Should_Update_User_Model_Correctly()
        {
            // Arrange
            var user = new Library.Models.User
            {
                UserName = "oldusername",
                FirstName = "OldFirstName",
                LastName = "OldLastName",
                Email = "oldemail@example.com"
            };

            var updateDto = new UserUpdateDTO
            {
                UserName = "newusername",
                FirstName = "NewFirstName",
                LastName = "NewLastName",
                Email = "newemail@example.com",
                Password = "OldPassword123",
                NewPassword = "NewPassword123"
            };

            // Act
            updateDto.UpdateUser(user);

            // Assert
            Assert.Equal("newusername", user.UserName);
            Assert.Equal("NewFirstName", user.FirstName);
            Assert.Equal("NewLastName", user.LastName);
            Assert.Equal("newemail@example.com", user.Email);
        }
    }
}