import {
  extend
} from 'vee-validate'

import {
  min,
  required,
  email,
  numeric
} from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'This field is required'
})

extend('min', {
  ...min,
  message: 'At least {length} letters'
})

extend('numeric', {
  ...numeric,
  message: 'This field must be an integer'
})

extend('email', {
  ...email,
  message: 'This field must be a valid email'
})
