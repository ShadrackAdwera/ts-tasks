import { Publisher, SectionCreatedEvent, Subjects } from '@adwesh/v2-common';

class SectionCreatedPublisher extends Publisher<SectionCreatedEvent> {
    subject: Subjects.SectionCreated = Subjects.SectionCreated;

}

export { SectionCreatedPublisher };