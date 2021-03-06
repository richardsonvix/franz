import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../lib/Form';
import { required, email, minLength } from '../../helpers/validation-helpers';
import Input from '../ui/Input';
import Radio from '../ui/Radio';
import Button from '../ui/Button';
import Link from '../ui/Link';

import { globalError as globalErrorPropType } from '../../prop-types';

const messages = defineMessages({
  headline: {
    id: 'signup.headline',
    defaultMessage: '!!!Sign up',
  },
  firstnameLabel: {
    id: 'signup.firstname.label',
    defaultMessage: '!!!Firstname',
  },
  lastnameLabel: {
    id: 'signup.lastname.label',
    defaultMessage: '!!!Lastname',
  },
  emailLabel: {
    id: 'signup.email.label',
    defaultMessage: '!!!Email address',
  },
  companyLabel: {
    id: 'signup.company.label',
    defaultMessage: '!!!Company',
  },
  passwordLabel: {
    id: 'signup.password.label',
    defaultMessage: '!!!Password',
  },
  legalInfo: {
    id: 'signup.legal.info',
    defaultMessage: '!!!By creating a Franz account you accept the',
  },
  terms: {
    id: 'signup.legal.terms',
    defaultMessage: '!!!Terms of service',
  },
  privacy: {
    id: 'signup.legal.privacy',
    defaultMessage: '!!!Privacy Statement',
  },
  submitButtonLabel: {
    id: 'signup.submit.label',
    defaultMessage: '!!!Create account',
  },
  loginLink: {
    id: 'signup.link.login',
    defaultMessage: '!!!Already have an account, sign in?',
  },
  emailDuplicate: {
    id: 'signup.emailDuplicate',
    defaultMessage: '!!!A user with that email address already exists',
  },
});

@observer
export default class Signup extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    loginRoute: PropTypes.string.isRequired,
    error: globalErrorPropType.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      accountType: {
        value: 'individual',
        validate: [required],
        options: [{
          value: 'individual',
          label: 'Individual',
        }, {
          value: 'non-profit',
          label: 'Non-Profit',
        }, {
          value: 'company',
          label: 'Company',
        }],
      },
      firstname: {
        label: this.context.intl.formatMessage(messages.firstnameLabel),
        value: '',
        validate: [required],
      },
      lastname: {
        label: this.context.intl.formatMessage(messages.lastnameLabel),
        value: '',
        validate: [required],
      },
      email: {
        label: this.context.intl.formatMessage(messages.emailLabel),
        value: '',
        validate: [required, email],
      },
      organization: {
        label: this.context.intl.formatMessage(messages.companyLabel),
        value: '', // TODO: make required when accountType: company
      },
      password: {
        label: this.context.intl.formatMessage(messages.passwordLabel),
        value: '',
        validate: [required, minLength(6)],
        type: 'password',
      },
    },
  }, this.context.intl);

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit(form.values());
      },
      onError: () => {},
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const { isSubmitting, loginRoute, error } = this.props;

    return (
      <div className="auth__scroll-container">
        <div className="auth__container auth__container--signup">
          <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
            <img
              src="./assets/images/logo.svg"
              className="auth__logo"
              alt=""
            />
            <h1>{intl.formatMessage(messages.headline)}</h1>
            <Radio field={form.$('accountType')} showLabel={false} />
            <div className="grid__row">
              <Input field={form.$('firstname')} focus />
              <Input field={form.$('lastname')} />
            </div>
            <Input field={form.$('email')} />
            <Input
              field={form.$('password')}
              showPasswordToggle
              scorePassword
            />
            {form.$('accountType').value === 'company' && (
              <Input field={form.$('organization')} />
            )}
            {error.code === 'email-duplicate' && (
              <p className="error-message center">{intl.formatMessage(messages.emailDuplicate)}</p>
            )}
            {isSubmitting ? (
              <Button
                className="auth__button is-loading"
                label={`${intl.formatMessage(messages.submitButtonLabel)} ...`}
                loaded={false}
                disabled
              />
            ) : (
              <Button
                type="submit"
                className="auth__button"
                label={intl.formatMessage(messages.submitButtonLabel)}
              />
            )}
            <p className="legal">
              {intl.formatMessage(messages.legalInfo)}
              <br />
              <Link
                to="http://meetfranz.com/terms"
                target="_blank"
                className="link"
              >
                {intl.formatMessage(messages.terms)}
              </Link>
              &nbsp;&amp;&nbsp;
              <Link
                to="http://meetfranz.com/privacy"
                target="_blank"
                className="link"
              >
                {intl.formatMessage(messages.privacy)}
              </Link>.
            </p>
          </form>
          <div className="auth__links">
            <Link to={loginRoute}>{intl.formatMessage(messages.loginLink)}</Link>
          </div>
        </div>
      </div>
    );
  }
}
