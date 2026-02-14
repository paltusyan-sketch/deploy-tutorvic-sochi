export class ModalForm {
  constructor(modalSelector, openBtnSelector, formSelector) {
    this.modal = document.querySelector(modalSelector);
    this.openBtn = document.querySelector(openBtnSelector);
    this.form = document.querySelector(formSelector);
    this.submitBtn = this.form.querySelector('button[type="submit"]');
    this.closeBtn = this.modal.querySelector('.modal__close');
    this.overlay = this.modal.querySelector('.modal__overlay');

    this.initEvents();
    this.updateSubmitState();
    this.initPhoneMask();
  }

  initEvents = () => {
    this.openBtn.addEventListener('click', this.open);
    this.closeBtn.addEventListener('click', this.close);
    this.overlay.addEventListener('click', this.close);
    this.form.addEventListener('submit', this.handleSubmit);

    this.form.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', this.updateSubmitState);
      input.addEventListener('change', this.updateSubmitState);
    });
  }

  open = () => {
    this.modal.classList.add('modal--active');
    this.updateSubmitState();
  }

  close = () => {
    this.modal.classList.remove('modal--active');
  }

  initPhoneMask = () => {
    const phoneInput = this.form.querySelector('#phone');
    if (!phoneInput) return;

    phoneInput.removeAttribute('pattern');

    IMask(phoneInput, {
      mask: '+{7} (000) 000-00-00'
    });
  }

  updateSubmitState = () => {
    const inputs = Array.from(this.form.querySelectorAll('input[required]'));
    const checkboxes = Array.from(this.form.querySelectorAll('input[type="checkbox"]'));
    const isCheckboxChecked = checkboxes.some(cb => cb.checked);

    const allFilled = inputs.every(input => {
      const value = input.value.trim();
      if (input.type === 'email') {
        return value !== '' && input.checkValidity();
      }

      if (input.type === 'tel') {
        const digits = value.replace(/\D/g, '');
        return digits.length >= 11;
      }
      return value !== '' && input.checkValidity();
    });

    this.submitBtn.disabled = !(allFilled && isCheckboxChecked);
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (this.form.website.value) return;

    let valid = true;

    this.form.querySelectorAll('input').forEach(input => {
      const isInvalid = input.type === 'tel'
        ? input.value.replace(/\D/g, '').length < 10
        : !input.checkValidity();

      input.classList.toggle('invalid', isInvalid);
      if (isInvalid) valid = false;
    });

    const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
    const checked = Array.from(checkboxes).some(cb => cb.checked);
    const fieldset = this.form.querySelector('fieldset');
    if (!checked) {
      fieldset.classList.add('invalid');
      valid = false;
    } else {
      fieldset.classList.remove('invalid');
    }

    if (!valid) return;

    const data = new FormData(this.form);
    try {
      const response = await fetch('https://formspree.io/f/movnkqyw', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        alert('Ошибка отправки формы. Попробуйте позже.');
        return;
      }

      alert('Форма успешно отправлена!');
      this.form.reset();
      this.updateSubmitState();
      this.close();

    } catch (err) {
      alert('Ошибка сети. Попробуйте позже.');
    }
  }
}
