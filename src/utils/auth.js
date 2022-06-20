import Cookies from 'js-cookie'
import Config from '@/settings'

const tokenKey = Config.tokenKey
const refTokenKey = Config.refTokenKey

// get token
export function getToken() {
  return Cookies.get(tokenKey) || ''
}

// set token
export function setToken(token) {
  Cookies.set(tokenKey, token)
}

// remove token
export function removeToken() {
  return Cookies.remove(tokenKey)
}

// get refresh token
export function getRefToken() {
  return Cookies.get(refTokenKey) || ''
}

// set refresh token
export function setRefToken(refToken) {
  Cookies.set(refTokenKey, refToken)
}

// remove refresh token
export function removeRefToken() {
  return Cookies.remove(refTokenKey)
}
