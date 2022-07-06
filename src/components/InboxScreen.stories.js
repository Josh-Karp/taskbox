import React from "react";

import InboxScreen from "./InboxScreen";
import store from "../lib/store";
import { rest } from "msw";
import { MockedState } from "./TaskList.stories";

import { Provider } from "react-redux";

import {
  fireEvent,
  within,
  waitFor,
  waitForElementToBeRemoved,
  findByRole,
} from "@storybook/testing-library";

import { expect } from "@storybook/jest";

export default {
  title: "InboxScreen",
  title: "InboxScreen",
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get(
        "https://jsonplaceholder.typicode.com/todos?userId=1",
        (req, res, ctx) => {
          return res(ctx.json(MockedState.tasks));
        }
      ),
    ],
  },
};

export const Error = Template.bind({});
Error.parameters = {
  msw: {
    handlers: [
      rest.get(
        "https://jsonplaceholder.typicode.com/todos?userId=1",
        (req, res, ctx) => {
          return res(ctx.status(403));
        }
      ),
    ],
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await waitForElementToBeRemoved(await canvas.findByTestId("loading"));
  await waitFor(async () => {
    await fireEvent.click(canvas.getByLabelText("pinTask-1"));
    await fireEvent.click(canvas.getByLabelText("pinTask-3"));

    // Archive
    // const itemToArchive = await canvas.getByLabelText("archiveTask-5");
    // const archiveCheckbox = await findByRole(itemToArchive, "input");
    // await fireEvent.click(archiveCheckbox);
    // await expect(
    //   canvas.getByLabelText("archiveTask-5")
    // ).not.toBeInTheDocument();
  });
};
