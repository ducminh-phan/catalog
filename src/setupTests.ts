// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

beforeEach(() => {
  let store: {
    [key: string]: string;
  } = {};

  spyOn(localStorage, "getItem").and.callFake((key) => store[key]);

  spyOn(localStorage, "setItem").and.callFake((key, value) => {
    store[key] = value;
    return value;
  });

  spyOn(localStorage, "clear").and.callFake(() => {
    store = {};
  });
});
