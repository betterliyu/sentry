import PropTypes from 'prop-types';
import React from 'react';
import {t} from 'app/locale';
import GroupEventDataSection from 'app/components/events/eventDataSection';
import SentryTypes from 'app/sentryTypes';
import {isStacktraceNewestFirst} from 'app/components/events/interfaces/stacktrace';
import CrashHeader from 'app/components/events/interfaces/crashHeader';
import CrashContent from 'app/components/events/interfaces/crashContent';

class ExceptionInterface extends React.Component {
  static propTypes = {
    group: SentryTypes.Group.isRequired,
    event: SentryTypes.Event.isRequired,
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      stackView: this.props.data.hasSystemFrames ? 'app' : 'full',
      newestFirst: isStacktraceNewestFirst(),
      stackType: 'original',
    };
  }

  eventHasThreads = () => {
    return !!this.props.event.entries.find(x => x.type === 'threads');
  };

  render() {
    const group = this.props.group;
    const event = this.props.event;
    const data = this.props.data;
    const stackView = this.state.stackView;
    const stackType = this.state.stackType;
    const newestFirst = this.state.newestFirst;

    // in case there are threads in the event data, we don't render the
    // exception block.  Instead the exception is contained within the
    // thread interface.
    if (this.eventHasThreads()) {
      return null;
    }

    const title = (
      <CrashHeader
        group={group}
        title={t('Exception')}
        platform={event.platform}
        exception={data}
        stackView={stackView}
        newestFirst={newestFirst}
        stackType={stackType}
        onChange={newState => {
          this.setState(newState);
        }}
      />
    );

    return (
      <GroupEventDataSection
        group={group}
        event={event}
        type={this.props.type}
        title={title}
        wrapTitle={false}
      >
        <CrashContent
          group={group}
          event={event}
          stackType={stackType}
          stackView={stackView}
          newestFirst={newestFirst}
          exception={data}
        />
      </GroupEventDataSection>
    );
  }
}

export default ExceptionInterface;
