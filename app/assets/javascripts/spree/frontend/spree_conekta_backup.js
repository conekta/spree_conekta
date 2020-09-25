// require conekta
// require_tree .
// require_self
jQuery(function() {
    //return Spree.Conekta = (function() {
        class SpreeConekta {
            constructor(form1, gatewayOptions) {
                this.successResponseHandler = this.successResponseHandler.bind(this);
                this.errorResponseHandler = this.errorResponseHandler.bind(this);
                this.form = form1;
                this.gatewayOptions = gatewayOptions;
                this.methods = this.form.find('input[name="order[payments_attributes][][payment_method_id]"]');
                this.currentMethod = this.methods.filter(':checked').val();
                this.listenMethodChange();
                this.listenSubmit();
            }

            listenSubmit() {
                return this.form.on('submit', (e) => {
                        var currentForm;
                e.preventDefault();
                currentForm = this.cleanForm();
                if (this.isConektaForm(currentForm)) {
                    return this.processPayment(currentForm);
                } else {
                    return this.submitForm();
                }
            });
            }

            isConektaForm(form) {
                return $('input', form).is("[data-conekta='card[name]']");
            }

            generateToken(form) {
                return window.Conekta.token.create(form, this.successResponseHandler, this.errorResponseHandler);
            }

            processPayment(form) {
                return this.generateToken(form);
            }

            processWithInstallments(form) {
                $.extend(this.gatewayOptions, window.Conekta._helpers.parseForm(form));
                return window.Conekta.charge.create(this.gatewayOptions, this.successResponseHandler, this.errorResponseHandler);
            }

            cleanForm() {
                var form;
                form = this.form.clone();
                form.find(`li:not(#payment_method_${this.currentMethod})`).remove();
                return form;
            }

            listenMethodChange() {
                return this.methods.on('change', (e) => {
                        return this.currentMethod = e.target.value;
            });
            }

            withInstallments(form) {
                return $('select, input', form).is("[data-conekta='monthly_installments']");
            }

            submitForm() {
                this.form.off('submit');
                return this.form.submit();
            }

            successResponseHandler(response) {
                this.saveConektaResponse(response);
                return this.submitForm();
            }

            errorResponseHandler(response) {
                this.saveConektaResponse(response);
                return this.submitForm();
            }

            saveConektaResponse(response) {
                this.form.find(`input[name='payment_source[${this.currentMethod}][gateway_payment_profile_id]']`).val(response.id);
                return this.form.find(`input[name='payment_source[${this.currentMethod}][conekta_response]']`).val(JSON.stringify(response));
            }

        };

        //Conekta.prototype.currentMethod = null;

      //  return Conekta;

    //}).call(this);
});
