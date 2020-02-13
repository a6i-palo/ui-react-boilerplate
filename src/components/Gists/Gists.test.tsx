import React from 'react';
import {Gists, GistList, IGist} from './Gists';
import {act} from 'react-dom/test-utils';
import {shallow, mount, ReactWrapper} from 'enzyme';

describe('Gists', () => {
    const mockGists: IGist[] = [
        {
            id: 1,
            // eslint-disable-next-line @typescript-eslint/camelcase
            html_url: 'http://example1.com',
            description: 'foobar',
        },
        {
            id: 2,
            // eslint-disable-next-line @typescript-eslint/camelcase
            html_url: 'http://example2.com',
            description: 'baxz',
        },
    ];

    // eslint-disable-next-line no-unused-expressions
    describe('Gists component', () => {
        let component: ReactWrapper;

        beforeAll(() => {
            const mockJsonPromise = Promise.resolve(mockGists);
            const mockFetchPromise = Promise.resolve({
                ok: true,
                json: () => mockJsonPromise,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            jest.spyOn(global as any, 'fetch').mockImplementation(() => mockFetchPromise);
        });

        test('should mount component with loading text', async () => {
            component = mount(<Gists />);

            const gists = component.find('#gistList');
            expect(gists.text()).toBe('...Loading Gists');

            await act(async () => {
                component.update();
            });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((global as any).fetch).toHaveBeenCalledTimes(1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect((global as any).fetch).toHaveBeenCalledWith('https://api.github.com/gists');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (global as any).fetch.mockClear();
        });

        test('should mount component with loaded data', () => {
            act(() => {
                component.update();
            });

            const gistsList = component.find(GistList);
            expect(gistsList.props().gists).toEqual(mockGists);
        });
    });
    describe('GistList component', () => {
        test('should render a list of gists', () => {
            const shallowComponent = shallow(<GistList gists={mockGists} />);
            const gists = shallowComponent.find('li');
            expect(gists).toHaveLength(2);
        });
    });
});
