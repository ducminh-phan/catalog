import { render } from "@testing-library/react";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";

import App from "./App";

configure({ adapter: new Adapter() });

test("renders learn react link", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
