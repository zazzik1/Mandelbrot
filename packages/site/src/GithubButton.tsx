import { IconButton } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { Tooltip } from './components/ui/tooltip';

const handleOnClick = () => {
    window.open('https://github.com/Zazzik1/Mandelbrot', '_blank', 'noopener noreferrer');
};

export default function GitHubButton() {
    return (
        <Tooltip content="See the GitHub repository">
            <IconButton
                onClick={handleOnClick}
                aria-label="GitHub"
                variant="ghost"
                padding="0 8px"
            >
                <FaGithub />
            </IconButton>
        </Tooltip>
    );
}
