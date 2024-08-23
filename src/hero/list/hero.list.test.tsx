import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SearchProvider } from "../../shared/SearchContext";
import HeroesList from "./page";
import * as heroService from "../../services/heroService";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../services/heroService", () => ({
  fetchHeroes: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

test("renders Heroes title", async () => {
  render(
    <SearchProvider>
      <HeroesList />
    </SearchProvider>,
  );
  const title = screen.getByText("Heroes");
  await waitFor(() => expect(title).toBeInTheDocument());
});

test("renders initial hero", async () => {
  (heroService.fetchHeroes as jest.Mock).mockResolvedValue({
    code: 200,
    status: "OK",
    data: {
      results: [
        {
          id: 1,
          name: "ZealMan",
          description: "A super powerful programmer",
          thumbnail: {
            path: "http://example.com/img",
            extension: "jpg",
          },
        },
      ],
    },
  });

  render(
    <MemoryRouter>
      <SearchProvider>
        <HeroesList />
      </SearchProvider>
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(screen.getByText("Hero: ZealMan")).toBeInTheDocument();
  });
});

test("handles empty results", async () => {
  (heroService.fetchHeroes as jest.Mock).mockResolvedValue({
    code: 200,
    status: "OK",
    data: {
      results: [],
    },
  });

  render(
    <MemoryRouter>
      <SearchProvider>
        <HeroesList />
      </SearchProvider>
    </MemoryRouter>,
  );

  await waitFor(() => {
    expect(screen.getByText("No heroes found!")).toBeInTheDocument();
  });
});

test("triggers search on input", async () => {
  (heroService.fetchHeroes as jest.Mock).mockImplementation((search) => {
    if (search === "Spider-Man") {
      return Promise.resolve({
        code: 200,
        status: "OK",
        data: {
          results: [
            {
              id: 2,
              name: "Spider-Man",
              description: "Can climb walls!",
              thumbnail: {
                path: "http://example.com/spider-img",
                extension: "jpg",
              },
            },
          ],
        },
      });
    }
    return Promise.resolve({
      code: 200,
      status: "OK",
      data: {
        results: [],
      },
    });
  });

  render(
    <MemoryRouter>
      <SearchProvider>
        <HeroesList />
      </SearchProvider>
    </MemoryRouter>,
  );

  fireEvent.change(screen.getByTestId("search-field"), {
    target: { value: "Spider-Man" },
  });
  await waitFor(() => {
    expect(screen.getByText("Hero: Spider-Man")).toBeInTheDocument();
  });
});
