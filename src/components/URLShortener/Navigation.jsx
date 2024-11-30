// src/components/Navigation.js

import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav>
            <ul>
                {/* Other links */}
                <li>
                   
                    <Link to="/url">Blank Page</Link>

                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
