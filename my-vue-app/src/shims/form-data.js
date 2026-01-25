export default class FormDataStub {
  append() {
    throw new Error('Uploads multipart não são suportados neste ambiente.')
  }

  getHeaders() {
    return {}
  }
}
