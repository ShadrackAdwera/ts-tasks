import { Publisher, SectionCreatedEvent, Subjects } from '@adwesh/v2-common';

class SectionPublisher extends Publisher<SectionCreatedEvent> {
    subject: Subjects.SectionCreated = Subjects.SectionCreated;

}

export { SectionPublisher };