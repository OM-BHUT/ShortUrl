import './loadingBar.css';

export function LoadingBar({ isLoading }) {
    return (
        <div
            className={`myClass ${isLoading ? 'loading75' : 'loading100'}`}
        />
    );
}
