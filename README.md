# merge-objects

Simple library to merge an arbritary number of objects together preserving getter and setter methods.

## Background

`Object.assign` and the spread operator only get you so far when you are trying to merge objects that contain getter and setter methods like:

```javascript
const person = {
  firstName: null,
  lastName: null,

  get name() {
    return `${this.firstName} ${this.lastName}`
  },
  set name(newName) {
    const [firstName, lastName] = newName.split(' ')

    this.firstName = firstName
    this.lastName = lastName
  },
}
```

If we wanted to create a clone of this we might think to use:

```javascript
const person2 = Object.assign({}, person)
```

but when we do this `person2` has a simple key based value for `name` not the dynamic value linked to `firstName` and `lastName` as person.

e.g.

```
> person.name = 'Iain Donaldson'
'Iain Donaldson'
> person
{ firstName: 'Iain', lastName: 'Donaldson', name: [Getter/Setter] }
> person2
{ firstName: 'Iain', lastName: 'Donaldson', name: 'Iain Donaldson' }
```

Using the spread operator results in the same thing, e.g.

```javascript
const person3 = { ...person }
```

`person3` now has keys that reflect the values of the getter in `person` and not the getter and setter methods themselves.

This package allwows you to combine objects that include getter/setter methods simply.

## Usage

Usage of this package is straightforward, e.g.:

```javascript
import mergeObjects from 'merge-objects'

const person = {
  firstName: null,
  lastName: null,

  get name() {
    return `${this.firstName} ${this.lastName}`
  },

  set name(newName) {
    const [firstName, lastName] = newName.split(' ')

    this.firstName = firstName
    this.lastName = lastName
  },
}

const address = {
  houseNumber: 10,
  streetName: 'Town Road',
  town: 'Townville',
  zip: '12233',
}

const mergedPerson = mergeObjects(person, address)
```

In the above example the new object will be the combination of the objects but maintains the getter and setter methods for the name as in the original object.

# Credits

Most of the actually useful code here comes from @joelmoss in [ibiza](https://github.com/joelmoss/ibiza) React 'state management for party animals' so thanks Joel!

I wanted this to allow me to destructure models in Ibiza as follows:

```javascript
import mergeObjects from 'merge-objects'
import { createModel } from 'ibiza'

const modelAccessors = {
  get name() {
    return `${this.firstName} ${this.lastName}`
  },
  set name(newName) {
    const [firstName, lastName] = newName.split(' ')

    this.firstName = firstName
    this.lastName = lastName
  },
}

const modelActions = {
  clearName() {
    this.firstName = ''
    this.lastName = ''
  },
}

const modelInitialProps = {
  firstName: null,
  lastName: null,
}

const model = createModel('model.mount.path', (_, runtimeProps) =>
  mergeObjects(modelInitialProps, modelAccessors, modelActions, runtimeProps)
)

export default model
```

This allows creation of more complex models with getters, setters and actions but not having to have them all in the same model defintion file.

# TODO

Add some tests!
