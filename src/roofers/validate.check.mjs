import assert from 'node:assert/strict'
import { isFullName, isEmail, isPhone, isCity, isWebsite, formatPhone } from './validate.js'

for (const ok of ['Jane Doe', "Mary-Kate O'Neil", 'José  Ruiz Jr.']) assert.ok(isFullName(ok), ok)
for (const bad of ['Jane', 'Jane 123', '12 34', '', 'J@ne Doe']) assert.ok(!isFullName(bad), bad)

for (const ok of ['a@b.co', ' jane@roof.com ']) assert.ok(isEmail(ok), ok)
for (const bad of ['jane@roof', 'jane@roof.c', 'jane roof@x.com', 'jane']) assert.ok(!isEmail(bad), bad)

for (const ok of ['(555) 234-5678', '555-234-5678', '+1 555 234 5678']) assert.ok(isPhone(ok), ok)
for (const bad of ['555-1234', '(055) 234-5678', '(555) 134-5678', 'abc', '']) assert.ok(!isPhone(bad), bad)

assert.equal(formatPhone('5552345678'), '(555) 234-5678')
assert.equal(formatPhone('+1 555 234 5678'), '(555) 234-5678')
assert.equal(formatPhone('5552'), '(555) 2')
assert.equal(formatPhone('555'), '555')

for (const ok of ['Dallas', 'St. Louis', "Coeur d'Alene", 'Winston-Salem']) assert.ok(isCity(ok), ok)
for (const bad of ['D', '75201', 'Dallas 2', '']) assert.ok(!isCity(bad), bad)

for (const ok of ['roofco.com', 'www.roof-co.com', 'https://roofco.com/about', ' RoofCo.net ']) assert.ok(isWebsite(ok), ok)
for (const bad of ['roofco', 'roof co.com', 'facebook', '']) assert.ok(!isWebsite(bad), bad)

console.log('validate: ok')
