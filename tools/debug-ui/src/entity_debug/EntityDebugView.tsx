import { useMemo, useReducer } from 'react';
import { Fetcher, FetcherContext } from './fetcher';
import { AllQueriesContext, allQueriesReducer } from './all_queries';
import { ColdStorageChoiceContext, PinnedKeysContext, pinnedKeysReducer } from './pinned_keys';
import { AllQueriesDisplay } from './AllQueriesDisplay';
import { BottomBarView } from './BottomBarView';
import { EntityDataRootView } from './EntityDataRootView';
import { EntityQueryComposer } from './EntityQueryComposer';
import './EntityDebugView.scss';
import { ShowAsciiCharactersInHexContext } from './view_options';

export type EntityDebugViewProps = {
    addr: string;
};

export const EntityDebugView = ({ addr }: EntityDebugViewProps) => {
    const fetcher = useMemo(() => new Fetcher(addr), [addr]);
    const [allQueries, allQueriesDispatcher] = useReducer(allQueriesReducer, {
        queries: [],
        results: [],
        selectedIndex: -1,
    });
    const [pinnedKeys, pinnedKeysDispatcher] = useReducer(pinnedKeysReducer, []);
    const [coldStorage, coldStorageDispatcher] = useReducer(
        (_: boolean, value: boolean) => value,
        false
    );
    const [showAscii, showAsciiDispatcher] = useReducer(
        (_showAscii: boolean, value: boolean) => value,
        true
    );
    const selectedQueryResult =
        allQueries.selectedIndex === -1 ? null : allQueries.results[allQueries.selectedIndex];

    const render = (
        <div className="entity-debug-view">
            <div className="left-panel">
                <div className="left-panel-query-list">
                    <AllQueriesDisplay />
                </div>
            </div>
            <div className="right-panel">
                <div className="right-panel-entity-tree">
                    {selectedQueryResult ? (
                        <div>
                            <EntityDataRootView node={selectedQueryResult} removalCallback={null} />
                        </div>
                    ) : (
                        <EntityQueryComposer />
                    )}
                </div>
                <div className="right-panel-pinned-keys">
                    <BottomBarView />
                </div>
            </div>
        </div>
    );
    return (
        <FetcherContext.Provider value={fetcher}>
            <AllQueriesContext.Provider
                value={{
                    queries: allQueries.queries,
                    results: allQueries.results,
                    selectedIndex: allQueries.selectedIndex,
                    dispatch: allQueriesDispatcher,
                }}>
                <PinnedKeysContext.Provider
                    value={{
                        keys: pinnedKeys,
                        dispatch: pinnedKeysDispatcher,
                    }}>
                    <ColdStorageChoiceContext.Provider
                        value={{
                            coldStorage: coldStorage,
                            dispatch: coldStorageDispatcher,
                        }}>
                        <ShowAsciiCharactersInHexContext.Provider
                            value={{
                                showAscii: showAscii,
                                dispatch: showAsciiDispatcher,
                            }}>
                            {render}
                        </ShowAsciiCharactersInHexContext.Provider>
                    </ColdStorageChoiceContext.Provider>
                </PinnedKeysContext.Provider>
            </AllQueriesContext.Provider>
        </FetcherContext.Provider>
    );
};
