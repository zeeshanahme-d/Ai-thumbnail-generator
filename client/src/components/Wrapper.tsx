import { type PropsWithChildren } from 'react';

const Wrapper = ({ children }: PropsWithChildren<{}>) => (
    <div className="w-full max-w-[1920px] px-4 md:px-10 lg:px-16 xl:px-32">
        {children}
    </div>
);

export default Wrapper;
