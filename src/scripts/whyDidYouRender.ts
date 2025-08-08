"use client";
// scripts/whyDidYouRender.ts
import React from 'react';

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    import('@welldone-software/why-did-you-render').then((whyDidYouRender) => {
        whyDidYouRender.default(React, {
            trackAllPureComponents: true,
            // trackExtraHooks: [[require('react-redux'), 'useSelector']],
        });
    });
}