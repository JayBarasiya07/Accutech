
document.addEventListener('DOMContentLoaded', function() {
    const qtyInput = document.getElementById('quantity');
    const qtyMinus = document.querySelector('.qty-minus');
    const qtyPlus = document.querySelector('.qty-plus');
    
    qtyMinus.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value, 10);
        if (currentValue > 1) {
            qtyInput.value = currentValue - 1;
        }
    });

    qtyPlus.addEventListener('click', function() {
        let currentValue = parseInt(qtyInput.value, 10);
        qtyInput.value = currentValue + 1;
    });
});


//checkout page - different shipping address feature
const choice = document.querySelector('#choice');

if(choice){

    choice.addEventListener('change',()=>{
        if(choice.checked){
            document.querySelector('.js-shipping-details').classList.remove('invisible');
        }
        else{
            document.querySelector('.js-shipping-details').classList.add('invisible');
        }
    });
}


//cart page - to change the quantity of the certain cart item
const quantityModifier = Array.from(document.getElementsByClassName('qty-mod'));

if(quantityModifier && quantityModifier.length>0){
    quantityModifier.forEach(function(qtyMod){
        const minusButton =qtyMod.children[0]; 
        const plusButton = qtyMod.children[2];
        const input = qtyMod.children[1];
        minusButton.addEventListener('click',function(){
            if(input.value==1){
                input.setAttribute('disabled','true');
                minusButton.setAttribute('disabled','true');
            }
            else{
                if(input.hasAttribute('disabled'))
                    input.removeAttribute('disabled');
                if(plusButton.hasAttribute('disabled'))
                    plusButton.removeAttribute('disabled');
                input.value = parseInt(input.value)-1;
            }
        });
        plusButton.addEventListener('click',function(){
            if(input.value==10){
                input.setAttribute('disabled','true');
                plusButton.setAttribute('disabled','true');
            }
            else{
                if(input.hasAttribute('disabled'))
                    input.removeAttribute('disabled');
                if(minusButton.hasAttribute('disabled'))
                    minusButton.removeAttribute('disabled');
                input.value = parseInt(input.value)+1;
            }
        });
    });
}

// Validations

function validateLoginForm() {
    let loginEmail = document.getElementById('loginEmail');
    let loginPassword = document.getElementById('loginPassword');

    let loginEmailError = document.getElementById('loginEmailError');
    let loginPasswordError = document.getElementById('loginPasswordError');

    let isValid = true;

    if (loginEmail.value.trim() === '') {
        loginEmailError.style.color = "red";
        loginEmailError.innerText = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.value)) {
        loginEmailError.style.color = "red";
        loginEmailError.innerText = 'Invalid email format';
        isValid = false;
    } else if (loginEmail.value.length > 100) {
        loginEmailError.style.color = "red";
        loginEmailError.innerText = 'Email must be 100 characters or less';
        isValid = false;
    } else {
        loginEmailError.innerText = '';
    }

    if (loginPassword.value.trim() === '') {
        loginPasswordError.style.color = "red";
        loginPasswordError.innerText = 'Password is required';
        isValid = false;
    } else if (loginPassword.value.length < 6) {
        loginPasswordError.style.color = "red";
        loginPasswordError.innerText = 'Password must be at least 6 characters long';
        isValid = false;
    } else if (loginPassword.value.length > 20) {
        loginPasswordError.style.color = "red";
        loginPasswordError.innerText = 'Password must be 20 characters or less';
        isValid = false;
    } else {
        loginPasswordError.innerText = '';
    }

    return isValid;
}

function validateForgotPasswordForm() {
    let email = document.getElementById('otpEmail');
    let emailError = document.getElementById('otpEmailError');
    let isValid = true;

    if (email.value.trim() === '') {
        emailError.style.color = "red";
        emailError.innerText = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.style.color = "red";
        emailError.innerText = 'Invalid email format';
        isValid = false;
    } else if (email.value.length > 100) {
        emailError.style.color = "red";
        emailError.innerText = 'Email must be 100 characters or less';
        isValid = false;
    } else {
        emailError.innerText = '';
    }

    return isValid;
}

function validateOtpForm() {
    let otp = document.getElementById('otp');
    let otpError = document.getElementById('otpError');

    let isValid = true;

    if (otp.value.trim() === '') {
        otpError.style.color = "red";
        otpError.innerText = 'OTP is required';
        isValid = false;
    } else if (!/^\d{6}$/.test(otp.value)) {
        otpError.style.color = "red";
        otpError.innerText = 'OTP must be exactly 6 digits';
        isValid = false;
    } else {
        otpError.innerText = '';
    }

    return isValid;
}

function validateRegistrationForm() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');

    let nameError = document.getElementById('nameError');
    let emailError = document.getElementById('emailError');
    let passwordError = document.getElementById('passwordError');
    let confirmPasswordError = document.getElementById('confirmPasswordError');

    let isValid = true;

    if (name.value.trim() === '') {
        nameError.style.color = "red";
        nameError.innerText = 'Name is required';
        isValid = false;
    } else if (/\d/.test(name.value)) {
        nameError.style.color = "red";
        nameError.innerText = 'Name should not contain numbers';
        isValid = false;
    } else if (name.value.length > 50) {
        nameError.style.color = "red";
        nameError.innerText = 'Name must be 50 characters or less';
        isValid = false;
    } else {
        nameError.innerText = '';
    }

    if (email.value.trim() === '') {
        emailError.style.color = "red";
        emailError.innerText = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        emailError.style.color = "red";
        emailError.innerText = 'Invalid email format';
        isValid = false;
    } else if (email.value.length > 100) {
        emailError.style.color = "red";
        emailError.innerText = 'Email must be 100 characters or less';
        isValid = false;
    } else {
        emailError.innerText = '';
    }

    if (phone.value.trim() === '') {
        phoneError.style.color = "red";
        phoneError.innerText = 'Mobile number is required';
        isValid = false;
    } else 
    if (!/^[6-9]\d{9}$/.test(phone.value)) {
        phoneError.style.color = "red";
        phoneError.innerText = 'Invalid mobile number format.';
        isValid = false;
    } 
    else {
        phoneError.innerText = '';
    }

    if (password.value.trim() === '') {
        passwordError.style.color = "red";
        passwordError.innerText = 'Password is required';
        isValid = false;
    } else if (password.value.length < 6) {
        passwordError.style.color = "red";
        passwordError.innerText = 'Password must be at least 6 characters long';
        isValid = false;
    } else if (password.value.length > 20) {
        passwordError.style.color = "red";
        passwordError.innerText = 'Password must be 20 characters or less';
        isValid = false;
    } else {
        passwordError.innerText = '';
    }

    if (confirmPassword.value.trim() === '') {
        confirmPasswordError.style.color = "red";
        confirmPasswordError.innerText = 'Confirm Password is required';
        isValid = false;
    } else if (confirmPassword.value !== password.value) {
        confirmPasswordError.style.color = "red";
        confirmPasswordError.innerText = 'Passwords do not match';
        isValid = false;
    } else {
        confirmPasswordError.innerText = '';
    }

    return isValid;
}

function contactFormValidation() {
    let contactName = document.getElementById('contactName');
    let contactEmail = document.getElementById('contactEmail');
    let contactPhone = document.getElementById('contactPhone');
    let contactMessage = document.getElementById('contactMessage');

    let contactNameError = document.getElementById('contactNameError');
    let contactEmailError = document.getElementById('contactEmailError');
    let contactPhoneError = document.getElementById('contactPhoneError');
    let contactMessageError = document.getElementById('contactMessageError');

    let isValid = true;

    if (contactName.value.trim() === '') {
        contactNameError.style.color="red";
        contactNameError.innerText = 'First Name is required';
        isValid = false;
    } else if (/\d/.test(contactName.value)) {
        contactNameError.style.color="red";
        contactNameError.innerText = 'First Name should not contain numbers';
        isValid = false;
    } else {
        contactNameError.innerText = '';
    }

    if (contactName2.value.trim() === '') {
        contactName2Error.style.color="red";
        contactName2Error.innerText = 'Last Name is required';
        isValid = false;
    } else if (/\d/.test(contactName2.value)) {
        contactName2Error.style.color="red";
        contactName2Error.innerText = 'Last Name should not contain numbers';
        isValid = false;
    } else {
        contactName2Error.innerText = '';
    }

    if (contactEmail.value.trim() === '') {
        contactEmailError.style.color="red";
        contactEmailError.innerText = 'Email is required';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.value)) {
        contactEmailError.style.color="red";
        contactEmailError.innerText = 'Invalid email format';
        isValid = false;
    } else {
        contactEmailError.innerText = '';
    }

    if (contactPhone.value.trim() === '') {
        contactPhoneError.style.color="red";
        contactPhoneError.innerText = 'Phone number is required';
        isValid = false;
    } else if (!/^\d{10}$/.test(contactPhone.value)) {
        contactPhoneError.style.color="red";
        contactPhoneError.innerText = 'Phone number must be 10 digits';
        isValid = false;
    } else {
        contactPhoneError.innerText = '';
    }

    if (contactMessage.value.trim() === '') {
        contactMessageError.style.color="red";
        contactMessageError.innerText = 'Message is required';
        isValid = false;
    } else {
        contactMessageError.innerText = '';
    }

    return isValid;
}


function validateChangePassword(){
    const currentPasswordInput = document.getElementById('currentPassword');
    const currentPasswordError = document.getElementById('currentPasswordError');
    const newPasswordInput = document.getElementById('newPassword');
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    let isValid = true;

    const currentPasswordValue = currentPasswordInput.value.trim();
    if (!currentPasswordValue) {
        currentPasswordError.innerText = 'Current password is required.';
        isValid = false;
    } else if (currentPasswordValue.length < 8) {

        currentPasswordError.innerText = 'Current password must be at least 8 characters long.';
        isValid = false;
    } else {
        currentPasswordError.innerText = ''; 
    }

    const newPasswordValue = newPasswordInput.value.trim();
    if (!newPasswordValue) {
        newPasswordError.innerText = 'New password is required.';
        isValid = false;
    } else if (newPasswordValue.length < 8) {
        newPasswordError.innerText = 'New password must be at least 8 characters long.';
        isValid = false;
    } else {
        newPasswordError.innerText = ''; 
    }


    const confirmPasswordValue = confirmPasswordInput.value.trim();
    if (!confirmPasswordValue) {
        confirmPasswordError.innerText = 'Confirm password is required.';
        isValid = false;
    } else if (confirmPasswordValue !== newPasswordValue) {
        confirmPasswordError.innerText = 'Passwords do not match.';
        isValid = false;
    } else {
        confirmPasswordError.innerText = '';
    }
    currentPasswordError.style.color="red";
    newPasswordError.style.color="red";
    confirmPasswordError.style.color="red";

    return isValid;
    
}
function validateMyAccountForm() {
    const firstNameInput = document.getElementById('firstName');
    const firstNameError = document.getElementById('firstNameError');
    const lastNameInput = document.getElementById('lastName');
    const lastNameError = document.getElementById('lastNameError');

    let isValid = true;

    const firstNameValue = firstNameInput.value.trim();
    if (!firstNameValue) {
        firstNameError.innerText = 'First Name is required.';
        isValid = false;
    } else if (/\d/.test(firstNameValue)) {
        firstNameError.innerText = 'First Name should not contain digits.';
        isValid = false;
    } else if (firstNameValue.length > 50) {
        firstNameError.innerText = 'First Name cannot exceed 50 characters.';
        isValid = false;
    } else {
        firstNameError.innerText = ''; 
    }

    const lastNameValue = lastNameInput.value.trim();
    if (!lastNameValue) {
        lastNameError.innerText = 'Last Name is required.';
        isValid = false;
    } else if (/\d/.test(lastNameValue)) {
        lastNameError.innerText = 'Last Name should not contain digits.';
        isValid = false;
    } else if (lastNameValue.length > 50) {
        lastNameError.innerText = 'Last Name cannot exceed 50 characters.';
        isValid = false;
    } else {
        lastNameError.innerText = '';
    }


    return isValid;
}


function validateForms() {
    let isValid = true;

    // Billing Details Validation
    let billingFirstName = document.getElementById('billingFirstName');
    let billingFirstNameError = document.getElementById('billingFirstNameError');

    if (billingFirstName.value.trim() === '') {
        billingFirstNameError.style.color="red";
        billingFirstNameError.innerText = 'First Name is required';
        isValid = false;
    } else if (billingFirstName.value.length > 50) {
        billingFirstNameError.style.color="red";
        billingFirstNameError.innerText = 'First Name must be 50 characters or less';
        isValid = false;
    } else {
        billingFirstNameError.innerText = '';
    }

    let billingLastName = document.getElementById('billingLastName');
    let billingLastNameError = document.getElementById('billingLastNameError');

    if (billingLastName.value.trim() === '') {
        billingLastNameError.style.color="red";
        billingLastNameError.innerText = 'Last Name is required';
        isValid = false;
    } else if (billingLastName.value.length > 50) {
        billingLastNameError.style.color="red";
        billingLastNameError.innerText = 'Last Name must be 50 characters or less';
        isValid = false;
    } else {
        billingLastNameError.innerText = '';
    }

    let billingAddress = document.getElementById('billingAddress');
    let billingAddressError = document.getElementById('billingAddressError');

    if (billingAddress.value.trim() === '') {
        billingAddressError.style.color="red";
        billingAddressError.innerText = 'Street Address is required';
        isValid = false;
    } else if (billingAddress.value.length > 100) {
        billingAddressError.style.color="red";
        billingAddressError.innerText = 'Street Address must be 100 characters or less';
        isValid = false;
    } else {
        billingAddressError.innerText = '';
    }

    let billingCity = document.getElementById('billingCity');
    let billingCityError = document.getElementById('billingCityError');

    if (billingCity.value.trim() === '') {
        billingCityError.style.color="red";
        billingCityError.innerText = 'City is required';
        isValid = false;
    } else if (billingCity.value.length > 50) {
        billingCityError.style.color="red";
        billingCityError.innerText = 'City must be 50 characters or less';
        isValid = false;
    } else {
        billingCityError.innerText = '';
    }

    let billingState = document.getElementById('billingState');
    let billingStateError = document.getElementById('billingStateError');

    if (billingState.value.trim() === '') {
        billingStateError.style.color="red";
        billingStateError.innerText = 'State is required';
        isValid = false;
    } else if (billingState.value.length > 50) {
        billingStateError.style.color="red";
        billingStateError.innerText = 'State must be 50 characters or less';
        isValid = false;
    } else {
        billingStateError.innerText = '';
    }

    let billingPinCode = document.getElementById('billingPinCode');
    let billingPinCodeError = document.getElementById('billingPinCodeError');

    if (billingPinCode.value.trim() === '') {
        billingPinCodeError.style.color="red";
        billingPinCodeError.innerText = 'Pin Code is required';
        isValid = false;
    } else if (!/^\d{6}$/.test(billingPinCode.value)) {
        billingPinCodeError.style.color="red";
        billingPinCodeError.innerText = 'Valid Pin Code is required';
        isValid = false;
    } else {
        billingPinCodeError.innerText = '';
    }

    let billingPhone = document.getElementById('billingPhone');
    let billingPhoneError = document.getElementById('billingPhoneError');

    if (billingPhone.value.trim() === '') {
        billingPhoneError.style.color="red";
        billingPhoneError.innerText = 'Phone Number is required';
        isValid = false;
    } else if (!/^\d{10}$/.test(billingPhone.value)) {
        billingPhoneError.style.color="red";
        billingPhoneError.innerText = 'Valid Phone Number is required';
        isValid = false;
    } else {
        billingPhoneError.innerText = '';
    }

    // Shipping Details Validation (only if checkbox is checked)
    /*if (document.getElementById('choice').checked) {
        let shippingFirstName = document.getElementById('shippingFirstName');
        let shippingFirstNameError = document.getElementById('shippingFirstNameError');

        if (shippingFirstName.value.trim() === '') {
            shippingFirstNameError.innerText = 'First Name is required';
            isValid = false;
        } else if (shippingFirstName.value.length > 50) {
            shippingFirstNameError.innerText = 'First Name must be 50 characters or less';
            isValid = false;
        } else {
            shippingFirstNameError.innerText = '';
        }

        let shippingLastName = document.getElementById('shippingLastName');
        let shippingLastNameError = document.getElementById('shippingLastNameError');

        if (shippingLastName.value.trim() === '') {
            shippingLastNameError.innerText = 'Last Name is required';
            isValid = false;
        } else if (shippingLastName.value.length > 50) {
            shippingLastNameError.innerText = 'Last Name must be 50 characters or less';
            isValid = false;
        } else {
            shippingLastNameError.innerText = '';
        }

        let shippingAddress = document.getElementById('shippingAddress');
        let shippingAddressError = document.getElementById('shippingAddressError');

        if (shippingAddress.value.trim() === '') {
            shippingAddressError.innerText = 'Street Address is required';
            isValid = false;
        } else if (shippingAddress.value.length > 100) {
            shippingAddressError.innerText = 'Street Address must be 100 characters or less';
            isValid = false;
        } else {
            shippingAddressError.innerText = '';
        }

        let shippingCity = document.getElementById('shippingCity');
        let shippingCityError = document.getElementById('shippingCityError');

        if (shippingCity.value.trim() === '') {
            shippingCityError.innerText = 'City is required';
            isValid = false;
        } else if (shippingCity.value.length > 50) {
            shippingCityError.innerText = 'City must be 50 characters or less';
            isValid = false;
        } else {
            shippingCityError.innerText = '';
        }

        let shippingState = document.getElementById('shippingState');
        let shippingStateError = document.getElementById('shippingStateError');

        if (shippingState.value.trim() === '') {
            shippingStateError.innerText = 'State is required';
            isValid = false;
        } else if (shippingState.value.length > 50) {
            shippingStateError.innerText = 'State must be 50 characters or less';
            isValid = false;
        } else {
            shippingStateError.innerText = '';
        }

        let shippingPinCode = document.getElementById('shippingPinCode');
        let shippingPinCodeError = document.getElementById('shippingPinCodeError');

        if (shippingPinCode.value.trim() === '') {
            shippingPinCodeError.innerText = 'Pin Code is required';
            isValid = false;
        } else if (!/^\d{6}$/.test(shippingPinCode.value)) {
            shippingPinCodeError.innerText = 'Valid Pin Code is required';
            isValid = false;
        } else {
            shippingPinCodeError.innerText = '';
        }

        let shippingPhone = document.getElementById('shippingPhone');
        let shippingPhoneError = document.getElementById('shippingPhoneError');

        if (shippingPhone.value.trim() === '') {
            shippingPhoneError.innerText = 'Phone Number is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(shippingPhone.value)) {
            shippingPhoneError.innerText = 'Valid Phone Number is required';
            isValid = false;
        } else {
            shippingPhoneError.innerText = '';
        }
    }*/

    return isValid;
}


function validateResetPasswordForm() {
    var newPassword = document.getElementById('newPassword').value.trim();
    var confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    var newPasswordError = document.getElementById('newPasswordError');
    var confirmPasswordError = document.getElementById('confirmPasswordError');
    
    var isValid = true;
    
    // Clear previous error messages
    newPasswordError.textContent = '';
    confirmPasswordError.textContent = '';
    
    // Check if new password field is empty
    if (newPassword === '') {
        newPasswordError.textContent = 'Please enter a new password.';
        isValid = false;
    } else if (newPassword.length < 8) {
        newPasswordError.textContent = 'Password must be at least 8 characters long.';
        isValid = false;
    }
    
    // Check if confirm password field is empty
    if (confirmPassword === '') {
        confirmPasswordError.textContent = 'Please confirm your new password.';
        isValid = false;
    }
    
    // Check if new password and confirm password match
    if (newPassword !== '' && confirmPassword !== '' && newPassword !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match.';
        isValid = false;
    }
    
    return isValid;
}

function validateSearch(){
    var searchBar = document.getElementById('searchBar');
    if(searchBar.value === '')
    {
        alert('Enter mobile name to search mobile');
        return false;
    }
    return true;
}