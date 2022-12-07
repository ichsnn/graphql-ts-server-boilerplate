import axios from "axios";

// Invalidate the URL
test("Send invalid back if bad id sent", async () => {
  const response = await axios(
    `${process.env.TEST_HOST}/auth/confirmation/1234`
  );
  const text = response.data;
  expect(text).toEqual("invalid");
});
