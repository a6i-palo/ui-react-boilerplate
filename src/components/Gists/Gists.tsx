import React, {useEffect, useState, FunctionComponent, StatelessComponent} from 'react';
import PropTypes from 'prop-types';
import './Gists.scss';

export interface IGist {
    html_url: string;
    description: string;
    id: number;
}

export interface IGistList {
    gists: IGist[];
}

export const Gists: FunctionComponent = () => {
    const [gists, setGists] = useState<IGist[]>();

    useEffect(() => {
        const retrieveData = async (): Promise<void> => {
            const data = await fetch('https://api.github.com/gists').then((response) => {
                if (!response.ok) {
                    throw new Error();
                }
                return response.json();
            });
            setGists(data);
        };

        retrieveData();
    }, []);

    return (
        <div id="gists">
            <div styleName="header">
                <h1>Unit Testing with Jest and Enzyme</h1>
                <h2>Github Gists</h2>
            </div>
            <section id="gistList">{gists ? <GistList gists={gists} /> : '...Loading Gists'}</section>
        </div>
    );
};

// Pure/Stateless Functional Component
export const GistList: StatelessComponent<IGistList> = ({gists}) => (
    <ul>
        {gists.map((gist: IGist) => (
            <li key={gist.id}>
                <a href={gist.html_url}>{gist.description || '---'}</a>
            </li>
        ))}
    </ul>
);

GistList.propTypes = {
    gists: PropTypes.array.isRequired,
};
