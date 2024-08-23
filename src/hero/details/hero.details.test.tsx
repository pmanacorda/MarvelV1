import { render, screen, waitFor } from "@testing-library/react";
import { SearchProvider } from "../../shared/SearchContext";
import HeroDetails from "./page";
import * as heroService from "../../services/heroService";

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
const mockUseLocation = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  useLocation: () => mockUseLocation(),
}));
jest.mock("../../services/heroService", () => ({
  fetchComics: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

test("renders Hero Comics title", async () => {
  mockNavigate.mockReturnValue(() => {});
  mockUseParams.mockReturnValue({ id: "1" });
  mockUseLocation.mockReturnValue({
    state: {
      hero: {
        id: 1,
        name: "ZealMan",
        description: "A super powerful programmer",
        thumbnail: {
          path: "http://example.com/img",
          extension: "jpg",
        },
      },
    },
  });

  (heroService.fetchComics as jest.Mock).mockResolvedValue({
    code: 200,
    status: "OK",
    data: {
      results: [
        {
          id: 1,
          title: "A funny comic!",
          thumbnail: {
            path: "http://thumbnail.com/img",
            extension: "jpg",
          },
        },
      ],
    },
  });
  render(
    <SearchProvider>
      <HeroDetails />
    </SearchProvider>,
  );
  const title = screen.getByText("ZealMan Comics");
  await waitFor(() => expect(title).toBeInTheDocument());
});

test("renders Comics image with expected path", async () => {
  mockNavigate.mockReturnValue(() => {});
  mockUseParams.mockReturnValue({ id: "1" });
  mockUseLocation.mockReturnValue({
    state: {
      hero: {
        id: 1,
        name: "ZealMan",
        description: "A super powerful programmer",
        thumbnail: {
          path: "http://example.com/img",
          extension: "jpg",
        },
      },
    },
  });

  (heroService.fetchComics as jest.Mock).mockResolvedValue({
    code: 200,
    status: "OK",
    data: {
      results: [
        {
          id: 1,
          title: "A funny comic!",
          thumbnail: {
            path: "http://thumbnail.com/img",
            extension: "jpg",
          },
        },
      ],
    },
  });
  render(
    <SearchProvider>
      <HeroDetails />
    </SearchProvider>,
  );
  await waitFor(() => {
    const image = screen.getByAltText("Comic") as HTMLImageElement;
    expect(image.src).toContain("http://thumbnail.com/img.jpg");
  });
});
