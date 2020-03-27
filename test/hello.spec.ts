import hello from "~/hello"

describe("hello", (): void => {
  it("Hello, world!", (): void => {
    const name = "world"
    expect(hello(name)).toBe("Hello, world!")
  })
})
