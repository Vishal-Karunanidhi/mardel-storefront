import { useEffect, useState } from 'react';
import notificationStyles from '@Styles/global/notificationBar.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import Grid from '@mui/material/Grid';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { NotificationBarSlotData, NotificationBarSlide } from 'src/types/header';
import Link from 'next/link';

export default function NotificationBar(props: NotificationBarSlotData) {
  const [notifications, setNotifications] = useState<NotificationBarSlide[]>(
    props.notifications ?? []
  );
  const [index, setIndex] = useState<number>(0);
  const [direction, setDirection] = useState<string>('');
  const [currentLink, setCurrentLink] = useState<string>('');
  const [paused, setPaused] = useState<boolean>(false);
  const { rotationDelay } = props.slotContent;

  const variants = {
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.15
      }
    },
    exit: {
      x: direction === 'forward' ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.15
      }
    }
  };

  const nextNotification = () => {
    if (direction !== 'forward') {
      setDirection('forward');
    } else {
      if (index < notifications.length - 1) {
        setIndex(index + 1);
      } else {
        setIndex(0);
      }
    }
  };

  const previousNotification = () => {
    if (direction !== 'backward') {
      setDirection('backward');
    } else {
      if (index > 0) {
        setIndex(index - 1);
      } else {
        setIndex(notifications.length - 1);
      }
    }
  };

  useEffect(() => {
    if (direction === 'forward') {
      nextNotification();
    } else if (direction === 'backward') {
      previousNotification();
    }
  }, [direction]);

  useEffect(() => {
    if (props.notifications) {
      setNotifications(props.notifications);
    }
  }, [props.notifications]);

  // useEffect(() => {
  //   let interval: NodeJS.Timer;
  //   const timeDelay = rotationDelay * 1000;

  //   if (notifications.length > 1) {
  //     interval = setInterval(() => {
  //       if (!paused) {
  //         nextNotification();
  //       }
  //     }, timeDelay);
  //   }

  //   return () => {
  //     if (interval) {
  //       clearInterval(interval);
  //     }
  //   };
  // });

  useEffect(() => {
    if (notifications[index]) {
      if (notifications[index].link === null) {
        setCurrentLink('');
      } else {
        if (notifications[index].link.value === null) {
          setCurrentLink('');
        } else {
          setCurrentLink(notifications[index].link.value);
        }
      }
    }
  });

  return (
    <>
      {notifications.length > 0 && (
        <Grid
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          justifyContent="center"
          alignItems="center"
          className={notificationStyles.bar}
          container
          spacing={2}
        >
          <Grid style={{ paddingLeft: 0 }} item>
            {notifications.length > 1 && (
              <button
                style={{ background: 'transparent', border: 'none' }}
                id={notificationStyles.leftArrow}
                className={notificationStyles.arrowContainer}
                onClick={previousNotification}
                aria-label="Go to previous alert"
              >
                <ArrowLeftIcon onClick={previousNotification} />
              </button>
            )}
          </Grid>
          <Grid style={{ width: '50%', paddingLeft: 0 }} item>
            <AnimatePresence exitBeforeEnter>
              <motion.div
                key={index}
                className={notificationStyles.text}
                variants={variants}
                initial={{ x: direction === 'forward' ? 100 : direction === 'backward' ? -100 : 0 }}
                animate="animate"
                exit="exit"
              >
                <Link className={notificationStyles.buttonText} href={currentLink} passHref>
                  <a
                    target={notifications[index].link.openInNewTab ? '_blank' : ''}
                    style={{ pointerEvents: currentLink === '' ? 'none' : 'initial' }}
                    aria-label={`alert (opens in new tab): ${notifications[index].title}`}
                    tabIndex={0}
                    rel="noreferrer"
                    data-testid="notification-bar-textlink"
                  >
                    {notifications[index] && notifications[index].title}
                  </a>
                </Link>
              </motion.div>
            </AnimatePresence>
          </Grid>
          <Grid style={{ paddingLeft: 0 }} item>
            {notifications.length > 1 && (
              <button
                style={{ background: 'transparent', border: 'none' }}
                id={notificationStyles.rightArrow}
                className={notificationStyles.arrowContainer}
                onClick={nextNotification}
                aria-label="Go to next alert"
              >
                <ArrowRightIcon onClick={nextNotification} />
              </button>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
}
